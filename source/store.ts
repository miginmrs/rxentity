import { Observable, TeardownLogic, Subscriber, Subscription, Subject } from 'rxjs';
import { PromiseCtr, Rec } from './common';
import { EntityFlow, Entity, ChildEntityImpl, EntityImpl, entityFlow, toEntity, EntityAbstract, $rewind, $update, getEntity } from "./entity";

interface IStore<ID, K extends string, T extends Rec<K>, V extends T> {
  get(id: ID, skipCurrent?: true): EntityFlow<K, T, V>;
}

export type DepEntityImpl<K extends string, T extends Rec<K>, P extends T, V extends T> = never extends P
  ? EntityAbstract<K, T, V> : ChildEntityImpl<K, T, P, V, never, Entity<K, P, any, any>>;

export class Store<ID, K extends string, T extends Rec<K>, P extends T = never, V extends T = T, impl extends DepEntityImpl<K, T, P, V> = DepEntityImpl<K, T, P, V>> implements IStore<ID, K, T, V> {
  private _items = new Map<ID, {
    id: ID, observers: Subscriber<Entity<K, T, V>>[], entity?: Entity<K, T, V, impl>,
    next?: PromiseLike<void>, parentSubscription?: Subscription, closed?: true, ready?: true;
  }>();
  readonly insersions = new Subject<ID[]>();
  readonly emptyInsersions = new Subject<ID>();

  constructor(
    readonly name: string,
    private finalize: (id: ID, entity: Entity<K, T, V>) => void,
    readonly promiseCtr: PromiseCtr,
    readonly parent: IStore<ID, K, P, any> | null = null,
  ) { }

  rewind(id: ID) {
    const item = this._items.get(id);
    getEntity(item?.entity)?.rewind();
  }
  /**
   * Ensures the existance of an entity with a givin id using a givin construction logic
   * @param id id of the item to be prepared
   * @param handler the asynchronous function to be executed in order to prepare the item
   * @returns an observable that holds the logic behind the entity construction
   */
  prepare(
    id: ID,
    handler: (
      id: ID, item: { readonly ready?: true; },
      join: (subsciption: Subscription) => void
    ) => void | PromiseLike<void>
  ): Observable<Entity<K, T, V, impl>> {
    const entityFlow = this.get(id);
    return new Observable<Entity<K, T, V, impl>>(subscriber => {
      const subsciption = entityFlow.observable.subscribe(subscriber);
      const item = this._items.get(id);
      if (!item) return; // assert item is not null (unless id has changed)
      // if the item exists but not because of `prepare` call, execute the handler anyway
      const next = item.next = (item.next || {
        then: (_: void, catcher: () => void) => {
          try { return this.promiseCtr.resolve(catcher()); } catch (e) { return this.promiseCtr.reject(e); }
        }
      }).then(undefined, () => {
        const i = item;
        if (!item.closed && !item.ready) {
          return handler(item.id, { get ready() { return i.ready } }, subs => subsciption.add(subs));
        }
      });
      next.then(undefined, () => { });
      return subsciption;
    });
  }

  nextBulk(items: { id: ID, data: V; }[]) {
    const insersions = items.filter(({ id, data }) => this._next(id, data)).map(({ id }) => id);
    this.insersions.next(insersions);
  }

  next(id: ID, data: V) {
    if (this._next(id, data)) this.insersions.next([id]);
  }

  private _next(id: ID, data: V) {
    const item = this._items.get(id);
    if (!item) return;
    if (item.entity) {
      $update(item.entity, data);
      item.ready = true;
      return false;
    } else {
      if (this.parent) {
        const parentFlow = this.parent.get(id);
        item.entity = toEntity<K, T, V, ChildEntityImpl<K, T, P, V, K>>(new ChildEntityImpl<K, T, P, V, K>({
          data, ready: false, parentPromise: {
            then: (setParent: (parent: Entity<K, P, any>) => void) => {
              const subscription = parentFlow.observable.subscribe(parent => setParent(parent));
              item.parentSubscription?.unsubscribe();
              item.parentSubscription = subscription;
            }
          }
        })) as Entity<K, T, V, impl>;
      } else {
        item.entity = toEntity<K, T, V, EntityImpl<K, T, V>>(
          new EntityImpl<K, T, V>(data)) as Entity<K, T, V, impl>;
      }
      const entity: Entity<K, T, V> = item.entity;
      item.ready = true;
      item.observers.forEach(subscriber => subscriber.next(entity));
      return true;
    }
  }

  updateId(oldId: ID, newId: ID) {
    /** @TODO consider when newId is taken */
    if (this._items.get(newId)) throw new Error('New Id "' + newId + '" is taken');
    const item = this._items.get(oldId);
    if (!item) return;
    item.id = newId;
    this._items.delete(oldId);
    this._items.set(newId, item);
    getEntity(item.entity)?.setParent();
    item.parentSubscription?.unsubscribe();
    if (this.parent) {
      const parentFlow = this.parent.get(newId);
      if (item.entity instanceof ChildEntityImpl) {
        const entity = item.entity as ChildEntityImpl<K, T, P, V, K>;
        item.parentSubscription = parentFlow.observable.subscribe(parent => {
          entity.setParent(parent);
        });
      }
    }
    // keep the locks in their places
  }

  // remove(id: K); use a `deleted` field instead

  update<M extends K>(id: ID, data: Pick<V, M>) {
    getEntity(this._items.get(id)?.entity)?.update(data);
  }

  private item(id: ID, observer: Subscriber<Entity<K, T, V>>) {
    let item = this._items.get(id);
    if (!item) this._items.set(id, item = { id, observers: [observer] });
    else item.observers.push(observer);
    return item;
  }

  get(id: ID, skipCurrent?: true): EntityFlow<K, T, V, impl> {
    return entityFlow<K, T, V, impl>(
      new Observable((subscriber: Subscriber<Entity<K, T, V, impl>>): TeardownLogic => {
        const item = this.item(id, subscriber);
        const observers = item.observers;
        if (item.entity) {
          if (!skipCurrent) subscriber.next(item.entity);
        } else {
          if (this.parent && !item.parentSubscription) {
            let run = !skipCurrent;
            // this._entities.set will not be runned when .next is invoked because it will be already unsubscribed
            item.parentSubscription = this.parent.get(id).observable.subscribe(parent => {
              item.entity = toEntity(
                new ChildEntityImpl<K, T, P, V, never>({ data: {}, parent, ready: true })) as Entity<K, T, V, impl>;
              this.emptyInsersions.next(item.id);
              if (run) observers.forEach(subscriber => subscriber.next(item.entity));
            });
            run = true;
          }
        }
        return () => {
          const id = item.id, i = observers.indexOf(subscriber);
          if (i !== -1) observers.splice(i, 1);
          if (!observers.length) {
            const subscription = item.parentSubscription;
            this._items.delete(id);
            item.closed = true;
            // debugger;
            if (item.entity) {
              this.finalize(id, item.entity);
            }
            if (subscription) {
              subscription.unsubscribe();
            }
          }
        };
      }));
  }
}

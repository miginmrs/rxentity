import { Observable, TeardownLogic, Subscriber, Subscription, Subject } from 'rxjs';
import { KeyOf, PromiseCtr } from './common';
import { EntityFlow, Entity, ChildEntityImpl, EntityImpl, entityFlow, toEntity, EntityAbstract } from "./entity";

interface IStore<K, T, V extends T> {
  get(id: K, skipCurrent?: true): EntityFlow<T, V>;
}


export class Store<K, T, P extends T = never, V extends T = T> implements IStore<K, T, V> {
  private _items = new Map<K, {
    id: K, observers: Subscriber<Entity<T, V>>[], entity?: Entity<T, V>,
    next?: PromiseLike<void>, parentSubscription?: Subscription, closed?: true, ready?: true;
  }>();
  readonly insersions = new Subject<K[]>();
  readonly emptyInsersions = new Subject<K>();

  constructor(
    readonly name: string,
    private finalize: (id: K, entity: Entity<T, V>) => void,
    readonly promiseCtr: PromiseCtr,
    readonly parent: IStore<K, P, any> | null = null,
  ) { }

  rewind(id: K) {
    const item = this._items.get(id);
    item?.entity?.rewind();
  }
  /**
   * Ensures the existance of an entity with a givin id using a givin construction logic
   * @param id id of the item to be prepared
   * @param handler the asynchronous function to be executed in order to prepare the item
   * @returns an observable that holds the logic behind the entity construction
   */
  prepare(
    id: K,
    handler: (
      id: K, item: { readonly ready?: true; },
      join: (subsciption: Subscription) => void
    ) => void | PromiseLike<void>
  ): Observable<Entity<T, V>> {
    const entityFlow = this.get(id);
    return new Observable<Entity<T, V>>(subscriber => {
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

  nextBulk(items: { id: K, data: V; }[]) {
    const insersions = items.filter(({ id, data }) => this._next(id, data)).map(({ id }) => id);
    this.insersions.next(insersions);
  }

  next(id: K, data: V) {
    if (this._next(id, data)) this.insersions.next([id]);
  }

  private _next(id: K, data: V) {
    const item = this._items.get(id);
    if (!item) return;
    if (item.entity) {
      item.entity.update(data);
      item.ready = true;
      return false;
    } else {
      if (this.parent) {
        const parentFlow = this.parent.get(id);
        item.entity = toEntity<T, V, EntityAbstract<T, V>>(new ChildEntityImpl<T, P, V, KeyOf<T>>({
          data, parentPromise: {
            then: (setParent: (parent: Entity<P, any>) => void) => {
              const subscription = parentFlow.observable.subscribe(parent => setParent(parent));
              item.parentSubscription?.unsubscribe();
              item.parentSubscription = subscription;
            }
          }
        }));
      } else {
        item.entity = toEntity(new EntityImpl<T, V>(data));
      }
      const entity: Entity<T, V> = item.entity;
      item.ready = true;
      item.observers.forEach(subscriber => subscriber.next(entity));
      return true;
    }
  }

  updateId(oldId: K, newId: K) {
    /** @TODO consider when newId is taken */
    if (this._items.get(newId)) throw new Error('New Id "' + newId + '" is taken');
    const item = this._items.get(oldId);
    if (!item) return;
    item.id = newId;
    this._items.delete(oldId);
    this._items.set(newId, item);
    item.entity?.setParent();
    item.parentSubscription?.unsubscribe();
    if (this.parent) {
      const parentFlow = this.parent.get(newId);
      if (item.entity instanceof ChildEntityImpl) {
        const entity = item.entity as ChildEntityImpl<T, P, V, KeyOf<T>>;
        item.parentSubscription = parentFlow.observable.subscribe(parent => {
          entity.setParent(parent);
        });
      }
    }
    // keep the locks in their places
  }

  // remove(id: K); use a `deleted` field instead

  update<M extends KeyOf<T>>(id: K, data: Pick<V, M>) {
    this._items.get(id)?.entity?.update(data);
  }

  private item(id: K, observer: Subscriber<Entity<T, V>>) {
    let item = this._items.get(id);
    if (!item) this._items.set(id, item = { id, observers: [observer] });
    else item.observers.push(observer);
    return item;
  }

  get(id: K, skipCurrent?: true): EntityFlow<T, V> {
    return entityFlow(new Observable((subscriber: Subscriber<Entity<T, V>>): TeardownLogic => {
      const item = this.item(id, subscriber);
      const observers = item.observers;
      if (item.entity) {
        if (!skipCurrent) subscriber.next(item.entity);
      } else {
        if (this.parent && !item.parentSubscription) {
          let run = !skipCurrent;
          // this._entities.set will not be runned when .next is invoked because it will be already unsubscribed
          item.parentSubscription = this.parent.get(id).observable.subscribe(parent => {
            item.entity = toEntity<T, V, EntityAbstract<T, V>>(new ChildEntityImpl<T, P, V, never>({ data: {}, parent }));
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

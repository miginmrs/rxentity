import { Observable, TeardownLogic, Subscriber, Subscription, Subject, of } from 'rxjs';
import { PromiseCtr, Rec } from './common';
import { EntityFlow, Entity, ChildEntityImpl, EntityImpl, entityFlow, toEntity, EntityAbstract, $rewind, $update, getEntity } from "./entity";

interface IStore<ID, K extends string, T extends Rec<K>, V extends T> {
  get(id: ID, skipCurrent?: true): EntityFlow<K, T, V, IStore<ID, K, T, V>>;
}

type Item<ID, K extends string, T extends Rec<K>, V extends T, S, impl extends EntityAbstract<K, T, V, S>> = {
  id: ID, observers: Subscriber<Entity<K, T, V, S>>[], entity?: Entity<K, T, V, S, impl>,
  next?: PromiseLike<void>, parentSubscription?: Subscription, closed?: true, ready?: true;
}

export abstract class AbstractStore<ID, K extends string, T extends Rec<K>, V extends T, S extends AbstractStore<ID, K, T, V, S, impl>, impl extends EntityAbstract<K, T, V, S>> implements IStore<ID, K, T, V> {
  protected _items = new Map<ID, Item<ID, K, T, V, S, impl>>();
  readonly insersions = new Subject<ID[]>();
  readonly emptyInsersions = new Subject<ID>();
  constructor(
    readonly name: string,
    private finalize: (id: ID, entity: Entity<K, T, V, S, impl>) => void,
    readonly promiseCtr: PromiseCtr,
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
      join: (subscription: Subscription) => void
    ) => void | PromiseLike<void>
  ): Observable<Entity<K, T, V, S, impl>> {
    const entityFlow = this.get(id);
    return new Observable<Entity<K, T, V, S, impl>>(subscriber => {
      const subscription = entityFlow.observable.subscribe(subscriber);
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
          return handler(item.id, { get ready() { return i.ready } }, subs => subscription.add(subs));
        }
      });
      next.then(undefined, () => { });
      return subscription;
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
      this.setItemEntity(id, data, item);
      const entity = item.entity;
      item.ready = true;
      item.observers.forEach(subscriber => subscriber.next(entity));
      return true;
    }
  }

  abstract setItemEntity(id: ID, data: V, item: Item<ID, K, T, V, S, impl>): void;
  abstract linkParentNewId(oldId: ID, newId: ID, item: Item<ID, K, T, V, S, impl>): void;
  abstract subscribeToParent(id: ID, item: Item<ID, K, T, V, S, impl>, skipCurrent?: true): void;

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
    this.linkParentNewId(oldId, newId, item);
  }

  update<M extends K>(id: ID, data: Pick<V, M>) {
    getEntity(this._items.get(id)?.entity)?.update(data);
  }

  private item(id: ID, observer: Subscriber<Entity<K, T, V, S>>) {
    let item = this._items.get(id);
    if (!item) this._items.set(id, item = { id, observers: [observer] });
    else item.observers.push(observer);
    return item;
  }

  get(id: ID, skipCurrent?: true): EntityFlow<K, T, V, S, impl> {
    return entityFlow<K, T, V, S, impl>(
      new Observable((subscriber: Subscriber<Entity<K, T, V, S, impl>>): TeardownLogic => {
        const item = this.item(id, subscriber);
        const observers = item.observers;
        if (item.entity) {
          if (!skipCurrent) subscriber.next(item.entity);
        } else {
          this.subscribeToParent(id, item, skipCurrent);
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
            if (item.entity) {
              getEntity(item.entity).unlinkAll()
            }
          }
        };
      }));
  }
}


export class ChildStore<ID, K extends string, T extends Rec<K>, V extends T, P extends T, pimpl extends EntityAbstract<K, P, any, any>, PS extends AbstractStore<ID, K, P, any, any, pimpl>> extends AbstractStore<ID, K, T, V, ChildStore<ID, K, T, V, P, pimpl, PS>, ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>> {

  constructor(
    name: string,
    finalize: (id: ID, entity: Entity<K, T, V, ChildStore<ID, K, T, V, P, pimpl, PS>, ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>>) => void,
    promiseCtr: PromiseCtr,
    readonly parent: PS,
  ) { super(name, finalize, promiseCtr) }

  setItemEntity(id: ID, data: V, item: Item<ID, K, T, V, ChildStore<ID, K, T, V, P, pimpl, PS>, ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>>) {
    const parentFlow = this.parent.get(id);
    item.entity = toEntity(new ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>({
      store: this, data, ready: false, parentPromise: {
        then: (setParent: (parent: Entity<K, P, any, any, pimpl>) => void) => {
          const subscription = parentFlow.observable.subscribe(parent => setParent(parent));
          item.parentSubscription?.unsubscribe();
          item.parentSubscription = subscription;
        }
      }
    }));
  }

  linkParentNewId(_oldId: ID, newId: ID, item: Item<ID, K, T, V, ChildStore<ID, K, T, V, P, pimpl, PS>, ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>>) {
    const parentFlow = this.parent.get(newId);
    const entity = item.entity;
    if (!entity) return;
    item.parentSubscription = parentFlow.observable.subscribe(parent => {
      getEntity(entity).setParent(parent);
    });
  }

  subscribeToParent(id: ID, item: Item<ID, K, T, V, ChildStore<ID, K, T, V, P, pimpl, PS>, ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>>, skipCurrent?: true) {
    if (!item.parentSubscription) {
      const observers = item.observers;
      let run = !skipCurrent;
      // this._entities.set will not be runned when .next is invoked because it will be already unsubscribed
      item.parentSubscription = this.parent.get(id).observable.subscribe(parent => {
        item.entity = toEntity(new ChildEntityImpl<K, T, V, P, ChildStore<ID, K, T, V, P, pimpl, PS>, pimpl>({ data: {}, parent, ready: true, store: this }));
        this.emptyInsersions.next(item.id);
        if (run) observers.forEach(subscriber => subscriber.next(item.entity));
      });
      run = true;
    }
  }
}

export class TopStore<ID, K extends string, T extends Rec<K>, V extends T = T> extends AbstractStore<ID, K, T, V, TopStore<ID, K, T, V>, EntityImpl<K, T, V, TopStore<ID, K, T, V>>> {
  constructor(
    name: string,
    finalize: (id: ID, entity: Entity<K, T, V, TopStore<ID, K, T, V>, EntityImpl<K, T, V, TopStore<ID, K, T, V>>>) => void,
    promiseCtr: PromiseCtr,
  ) { super(name, finalize, promiseCtr) }

  setItemEntity(_id: ID, data: V, item: Item<ID, K, T, V, TopStore<ID, K, T, V>, EntityImpl<K, T, V, TopStore<ID, K, T, V>>>) {
    item.entity = toEntity<K, T, V, TopStore<ID, K, T, V>, EntityImpl<K, T, V, TopStore<ID, K, T, V>>>(
      new EntityImpl<K, T, V, TopStore<ID, K, T, V>>(data, this));
  }

  linkParentNewId() { }

  subscribeToParent() { }

}
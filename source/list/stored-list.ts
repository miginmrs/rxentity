import { Subscription, Observable, Subscriber } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { ChildEntityImpl, Entity, EntityAbstract, EntityFlow, EntityImpl, getEntity } from '../entity';
import { Entities, EntitiesFlow, ListStatus, EntityList, AbstractEntities, AbstractStores, EntitiesImpl, TopStores, ChildEntitiesImpl, ChildStores } from './types';
import { asAsync, Keys, PromiseCtr, TRec, wait } from '../common'

type EntityWithSubscrition<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, S extends Record<K, unknown>, impl extends AbstractEntities<K, KK, T, V, S> = AbstractEntities<K, KK, T, V, S>> = { entity: Entities<K, KK, T, V, S, impl>, subscription: Subscription; };

export type Params<K extends string, ID extends Pick<any, K>, key extends K, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V, stores>, stores extends AbstractStores<K, ID, KK, T, V, stores, impl>> = {
  /** 
   * Retrieve function
   * @returns {PromiseLike<{ done?: boolean, data: V[]; }>} `done` is undefined means information is not available, check parent
   */
  retrieve: (first?: Entities<K, KK, T, V, stores, impl>, last?: Entities<K, KK, T, V, stores, impl>) => PromiseLike<{ done?: boolean, data: V[]; }>,
  stores: stores,
  key: key,
  keyof: <k extends K>(k: k, data: V[k]) => ID[k],
  keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], any, stores[k]>) => ID[k],
  merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V, stores, impl>[], list2: EntityWithSubscrition<K, KK, T, V, stores, impl>[]) => EntityWithSubscrition<K, KK, T, V, stores, impl>[],
  promiseCtr: PromiseCtr,
};


export abstract class AbstractStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>,
  key extends K, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V, stores>,
  stores extends AbstractStores<K, ID, KK, T, V, stores, impl>,
  > implements EntityList<K, ID, KK, T, V, stores, impl, key> {
  protected parentSubsctiption?: Subscription;
  private retrieve: (first?: Entities<K, KK, T, V, stores, impl>, last?: Entities<K, KK, T, V, stores, impl>, err?: any) => PromiseLike<{ done?: boolean, data: Pick<V, K>[]; }>;
  /** list is null when `entities` has no subscription */
  protected list: { data: EntityWithSubscrition<K, KK, T, V, stores, impl>[], status: ListStatus; } | null = null;
  protected subscriber: Subscriber<{ list: Entities<K, KK, T, V, stores, impl>[], status: ListStatus; }> | null = null;
  private donePromises: (PromiseLike<ListStatus> | undefined)[] = [];
  readonly key: key;
  readonly merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V, stores, impl>[], list2: EntityWithSubscrition<K, KK, T, V, stores, impl>[]) => EntityWithSubscrition<K, KK, T, V, stores, impl>[];
  readonly keys: Keys<K>;
  readonly stores: stores;
  readonly keyof: <k extends K>(k: k, data: V[k]) => ID[k];
  readonly keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], any, any>) => ID[k];
  readonly promiseCtr: PromiseCtr;
  /**
   * @param {Params} params 
   */
  constructor(params: Params<K, ID, key, KK, T, V, impl, stores>) {
    const { key, merge, retrieve, keyof, keyofEntity, stores, promiseCtr } = params;
    this.keyof = keyof;
    this.keyofEntity = keyofEntity;
    this.stores = stores;
    this.keys = new Keys(stores);
    this.retrieve = retrieve;
    this.key = key;
    this.merge = merge;
    this.promiseCtr = promiseCtr;
  }

  add(entity: Entities<K, KK, T, V, stores, impl>) {
    const key = this.key;
    const id = this.keyofEntity(key, entity[key]);
    if (this.list === null || this.list.data.find(e => this.keyofEntity(key, e.entity[key]) === id)) return;
    const subscription = new Subscription();
    const stores = this.stores;
    new Keys<K>(entity).keys.forEach(k => {
      const obs = stores[k].get(id).observable;
      subscription.add(obs.subscribe());
    });
    this.list = { data: [{ entity, subscription }, ...this.list.data], status: this.list.status };
    this.subscriber?.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
  }

  remove(entity: Entities<K, KK, T, V, stores, impl>[key]) {
    if (this.list === null) return;
    const index = this.list.data.findIndex(e => e.entity[this.key] === entity);
    if (index !== -1) {
      const list = this.list;
      this.removeFromParent(entity);
      list.data[index].subscription.unsubscribe();
      list.data.splice(index, 1);
      this.subscriber?.next({ list: list.data.map(e => e.entity), status: list.status });
    }
  }

  abstract removeFromParent(entity: Entities<K, KK, T, V, stores, impl>[key]): void;

  protected toPromise(flowList: EntitiesFlow<K, KK, T, V, stores, impl>[]): PromiseLike<EntityWithSubscrition<K, KK, T, V, stores, impl>[]> {
    const entitiesWithSubs: PromiseLike<EntityWithSubscrition<K, KK, T, V, stores, impl>>[] = flowList.map(
      asAsync(function* (entitiesFlow) {
        const subscription = new Subscription();
        const entity = this.keys.asyncMapTo<{ [k in K]: Entity<KK[k], T[k], V[k], stores[k], impl[k] & EntityAbstract<KK[k], T[k], V[k], stores[k]>> }>(
          <k extends K>(k: k) => new this.promiseCtr<Entity<KK[k], T[k], V[k], stores[k], impl[k] & EntityAbstract<KK[k], T[k], V[k], stores[k]>>>(
            res => subscription.add(entitiesFlow[k].observable.subscribe(res))
          ), this.promiseCtr
        );
        return yield* wait(entity.then((entity) => ({ subscription, entity })));
      }, this.promiseCtr, this)
    );
    return this.promiseCtr.all(entitiesWithSubs);
  }

  protected _status(child: ListStatus, parent: ListStatus) {
    return child === null ? null : child ?? parent;
  }

  readonly entities = new Observable<{ list: Entities<K, KK, T, V, stores, impl>[], status: ListStatus; }>(subscriber => {
    this.list = { data: [], status: undefined };
    this.subscriber = subscriber;
    this.reload();
    return () => {
      this.parentSubsctiption?.unsubscribe();
      this.parentSubsctiption = undefined;
      this.subscriber = null;
      this.list?.data.forEach(e => e.subscription.unsubscribe());
      this.list = null;
    };
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private _populate(retrieved: Pick<V, K>[]): PromiseLike<EntityWithSubscrition<K, KK, T, V, stores, impl>[]> {
    const flowList = retrieved.map(p => this.keys.mapTo(k => this.stores[k].get(this.keyof(k, p[k]))));
    const entitiesPromise = this.toPromise(flowList);
    this.keys.keys.forEach(k => this.stores[k].nextBulk(retrieved.map(p => ({ id: this.keyof(k, p[k]), data: p[k] }))));
    return entitiesPromise;
  }

  reload(err?: any): PromiseLike<ListStatus> {
    return this.exec(0, err);
  }
  more(err?: any): PromiseLike<ListStatus> {
    return this.exec(1, err);
  }

  private _setDone<V>(n: number, done: PromiseLike<ListStatus>[], v: V | null): v is V {
    if (v === null) {
      done[0] = this.promiseCtr.resolve(true);
      return false;
    }
    if (n > 0) {
      const prev = this.donePromises[n - 1];
      if (prev) {
        done[0] = prev;
        return false;
      }
    }
    return true;
  }

  exec(n: number, err: any, from?: Entities<K, KK, T, V, stores, impl>, to?: Entities<K, KK, T, V, stores, impl>): PromiseLike<ListStatus> {
    return (this.donePromises[n] || (this.donePromises[n] = this._exec(n, err, from, to)));
  }

  private _exec = (n: number, err: any, from?: Entities<K, KK, T, V, stores, impl>, to?: Entities<K, KK, T, V, stores, impl>): PromiseLike<ListStatus> => asAsync(function* () {
    let done: PromiseLike<ListStatus>[] = [];
    try {
      console.log(1, {n, err, from, to, this: this})
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log(2, {n, err, from, to, this: this})
      const oldList = n ? this.list.data : [];
      [from, to] = [from || oldList[0]?.entity, to || oldList[oldList.length - 1]?.entity];
      const retrieved = yield* wait(this.retrieve(from, to, err));
      console.log(3, {n, err, from, to, this:this, retrieved})
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log(4, {n, err, from, to, this: this})
      const list = yield* wait(this._populate(retrieved.data));
      console.log(5, {n, err, from, to, this: this})
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log(6, {n, err, from, to, this: this})
      // if reload, unsubscribe from old entities
      if (!n) this.list.data.forEach(e => e.subscription.unsubscribe());
      this.list = { data: oldList.concat(list), status: retrieved.done };
      const process = () => {
        if (!this.list) throw new Error('Unexpected state');
        this.subscriber!.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
        return retrieved.done;
      }
      console.log(7, {n, err, from, to, this: this})
      return retrieved.done === undefined ? yield* this.fromParent(n, process) : process();
    } catch (e) {
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log(8, {n, err, from, to, this: this})
      this.list.status = null;
      return yield* this.handleError(n, e);
    } finally {
      console.log(9, {n, err, from, to, this: this})
      this.donePromises[n] = undefined;
    }
  }, this.promiseCtr, this)();
  abstract fromParent(n: number, process: () => boolean | undefined): Generator<any, ListStatus, any>;
  abstract handleError(n: number, error: any): Generator<any, ListStatus, any>;
}
export class TopStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>,
  key extends K, T extends TRec<K, KK>, V extends T = T> extends AbstractStoredList<K, ID, KK, key, T, V, EntitiesImpl<K, KK, T, V, TopStores<K, ID, KK, T, V>>, TopStores<K, ID, KK, T, V>> {
  *handleError(_n: number, e: any): Generator<never, ListStatus, unknown> { throw e; }
  *fromParent(_n: number, process: () => boolean | undefined): Generator<any, ListStatus, any> { return process(); }
  removeFromParent() { }
}
type CStores<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>,
  V extends T, P extends T, S extends CStores<K, ID, KK, T, V, P, S, pimpl>, pimpl extends AbstractEntities<K, KK, P, any, any>
  > = ChildStores<K, ID, KK, T, V, P, pimpl, AbstractStores<K, ID, KK, P, any, any, pimpl>> & AbstractStores<K, ID, KK, T, V, S, ChildEntitiesImpl<K, KK, T, V, P, S, pimpl>>;
export class ChildStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>,
  key extends K, T extends TRec<K, KK>, V extends T, P extends T, pimpl extends AbstractEntities<K, KK, P, any, any>,
  stores extends CStores<K, ID, KK, T, V, P, stores, pimpl>,
  PL extends AbstractStoredList<K, ID, KK, key, P, any, pimpl, AbstractStores<K, ID, KK, P, any, any, pimpl>>>
  extends AbstractStoredList<K, ID, KK, key, T, V, ChildEntitiesImpl<K, KK, T, V, P, stores, pimpl>, stores> {
  readonly parent: PL
  constructor(params: Params<K, ID, key, KK, T, V, ChildEntitiesImpl<K, KK, T, V, P, stores, pimpl>, stores> & { parent: PL }) {
    super(params);
    this.parent = params.parent;
  }
  private parentSubscriber = () => new this.promiseCtr<ListStatus>((resolve, reject) => {
    this.parentSubsctiption = this.parent?.entities.subscribe(parentList => asAsync(function* () {
      const key = this.key;
      type impl = ChildEntitiesImpl<K, KK, T, V, P, stores, pimpl>;
      const flowList: EntitiesFlow<K, KK, T, V, stores, impl>[]
        = parentList.list.map(e => this.keys.mapTo<EntitiesFlow<K, KK, T, V, stores, impl>>(
          <k extends K>(k: k): EntityFlow<KK[k], T[k], V[k], stores[k], impl[k] & EntityAbstract<KK[k], T[k], V[k], stores[k]>> => {
            const stores: AbstractStores<K, ID, KK, T, V, stores, ChildEntitiesImpl<K, KK, T, V, P, stores, pimpl>> = this.stores;
            return stores[k].get(this.keyofEntity(k, e[k]));
          }));
      const entitiesSet = new Set(this.list?.data.map(u => u.entity[key]));
      const parentEntities = yield* wait(this.toPromise(flowList));

      const newIds = parentEntities.filter(e => !entitiesSet.has(e.entity[key])).map(
        e => this.keys.mapTo<ID>(k => this.keyofEntity(k, e.entity[k]))
      );
      // console.log('newIds', newIds, this.store);
      const newEntities: EntityWithSubscrition<K, KK, T, V, stores, impl>[] = yield* wait(this.toPromise(newIds.map(id => this.keys.mapTo(
        <k extends K>(k: k) => this.stores[k].get(id[k])
      ))));
      // unsubscribe after new subscription made to reuse recently created entities
      parentEntities.forEach(s => s.subscription.unsubscribe());
      if (!this.list) return reject();
      const newList = this.merge(key, this.list.data, newEntities);
      this.list = { data: newList, status: this._status(this.list.status, parentList.status) };
      this.subscriber?.next({ list: this.list.data.map(({ entity }) => entity), status: this.list.status });
      return resolve(this.list.status);
    }, this.promiseCtr, this)());
  });

  *fromParent(n: number) {
    try {
      const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, null) : this.parentSubscriber());
      return parentDone;
    } catch (e) {
      // unsubscribed while retrieving data from parent
      return true;
    }
  }
  *handleError(n: number, e: any) {
    try {
      const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, e) : this.parentSubscriber());
      return this._status(null, parentDone);
    } catch (e) {
      // unsubscribed while retrieving data from parent
      return true;
    }
  }
  removeFromParent(entity: Entities<K, KK, T, V, stores, ChildEntitiesImpl<K, KK, T, V, P, stores, pimpl>>[key]) {
    const entityImpl = getEntity(entity)
    if (entityImpl instanceof ChildEntityImpl) {
      const childEntityImpl = entityImpl as ChildEntityImpl<KK[key], T[key], V[key], any, stores[key], any>
      if(childEntityImpl.parent) this.parent.remove(childEntityImpl.parent)
    }
  }

}

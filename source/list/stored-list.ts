import { Subscription, Observable, Subscriber, ReplaySubject, from } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Entity } from '../entity';
import { Stores, Entities, EntitiesFlow, ListStatus, EntityList } from './types';
import { asAsync, Keys, PromiseCtr, wait } from '../common'

type EntityWithSubscrition<T, V extends T> = { entity: Entities<T, V>, subscription: Subscription; };

type Params<K extends Pick<any, keyof T>, key extends keyof T, T, V extends T = T, P extends T = never> = {
  /** 
   * Retrieve function
   * @returns {PromiseLike<{ done?: boolean, data: V[]; }>} `done` is undefined means information is not available, check parent
   */
  retrieve: (first?: Entities<T, any>, last?: Entities<T, any>) => PromiseLike<{ done?: boolean, data: V[]; }>,
  stores: Stores<K, T, P, V>,
  key: key,
  keyof: <k extends keyof T>(k: k, data: V[k]) => K[k],
  keyofEntity: <k extends keyof T>(k: k, data: Entity<T[k], V[k]>) => K[k],
  merge: (key: key, list1: EntityWithSubscrition<T, V>[], list2: EntityWithSubscrition<T, V>[]) => EntityWithSubscrition<T, V>[],
  parent?: EntityList<K, Pick<P, keyof T>, any>,
  promiseCtr: PromiseCtr,
};

export class StoredList<K extends Pick<any, keyof T>, key extends keyof T, T, V extends T = T, P extends T = never> implements EntityList<K, T, V> {
  private parentSubsctiption?: Subscription;
  private retrieve: (first?: Entities<T, any>, last?: Entities<T, any>, err?: any) => PromiseLike<{ done?: boolean, data: Pick<V, keyof T>[]; }>;
  /** list is null when `entities` has no subscription */
  private list: { data: EntityWithSubscrition<T, V>[], status: ListStatus; } | null = null;
  private subscriber: Subscriber<{ list: Entities<T, V>[], status: ListStatus; }> | null = null;
  private donePromises: (PromiseLike<ListStatus> | undefined)[] = [];
  readonly key: key;
  readonly merge: (key: key, list1: EntityWithSubscrition<T, V>[], list2: EntityWithSubscrition<T, V>[]) => EntityWithSubscrition<T, V>[];
  readonly parent?: EntityList<K, Pick<P, keyof T>, any>;
  readonly keys: Keys<keyof T>;
  readonly stores: Stores<K, T, any, V>;
  readonly keyof: <k extends keyof T>(k: k, data: V[k]) => K[k];
  readonly keyofEntity: <k extends keyof T>(k: k, data: Entity<T[k], V[k]>) => K[k];
  readonly promiseCtr: PromiseCtr;
  /**
   * @param {Params} params 
   */
  constructor(params: Params<K, key, T, V, P>) {
    const { key, merge, retrieve, parent, keyof, keyofEntity, stores, promiseCtr } = params;
    this.keyof = keyof;
    this.keyofEntity = keyofEntity;
    this.stores = stores;
    this.keys = new Keys(stores);
    this.retrieve = retrieve;
    this.key = key;
    this.merge = merge;
    this.parent = parent;
    this.promiseCtr = promiseCtr;
  }

  add(entity: Entities<T, V>) {
    const key = this.key;
    const id = this.keyofEntity(key, entity[key]);
    if (this.list === null || this.list.data.find(e => this.keyofEntity(key, e.entity[key]) === id)) return;
    const subscription = new Subscription();
    const stores = this.stores;
    new Keys(entity).keys.forEach(k => {
      subscription.add(stores[k].get(id).observable.subscribe());
    });
    this.list = { data: [{ entity, subscription }, ...this.list.data], status: this.list.status };
    this.subscriber?.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
  }

  remove(entity: Entities<T, V>) {
    if (this.list === null) return;
    const index = this.list.data.findIndex(e => e.entity === entity);
    if (index !== -1) {
      const list = this.list;
      list.data[index].subscription.unsubscribe();
      list.data.splice(index, 1);
      this.subscriber?.next({ list: list.data.map(e => e.entity), status: list.status });
    }
  }

  protected toPromise(flowList: EntitiesFlow<T, V>[]): PromiseLike<EntityWithSubscrition<T, V>[]> {
    return this.promiseCtr.all(flowList.map(async entitiesFlow => {
      const subscription = new Subscription();
      return {
        subscription, entity: await this.keys.asyncMapTo<{ [k in keyof T]: Entity<T[k], V[k]> }>(
          <k extends keyof T>(k: k) => new this.promiseCtr<Entity<T[k], V[k]>>(
            res => entitiesFlow[k].observable.subscribe(res)
          ), this.promiseCtr
        )
      };
    }));
  }

  private _status(child: ListStatus, parent: ListStatus) {
    return child === null ? null : child ?? parent;
  }

  private parentSubscriber = () => new this.promiseCtr<ListStatus>((resolve, reject) => {
    this.parentSubsctiption = this.parent?.entities.subscribe(async parentList => {
      const key = this.key;
      const flowList: EntitiesFlow<T, V>[]
        = parentList.list.map(e => this.keys.mapTo<EntitiesFlow<T, V>>(
          k => this.stores[k].get(this.keyofEntity(k, e[k]))));
      const entitiesSet = new Set(this.list?.data.map(u => u.entity[key]));
      const parentEntities = await this.toPromise(flowList);

      const newIds = parentEntities.filter(e => !entitiesSet.has(e.entity[key])).map(
        e => this.keys.mapTo<K>(k => this.keyofEntity(k, e.entity[k]))
      );
      // console.log('newIds', newIds, this.store);
      const newEntities: EntityWithSubscrition<T, V>[] = await this.toPromise(newIds.map(id => this.keys.mapTo(
        <k extends keyof T>(k: k) => this.stores[k].get(id[k])
      )));
      // unsubscribe after new subscription made to reuse recently created entities
      parentEntities.forEach(s => s.subscription.unsubscribe());
      if (!this.list) return reject();
      const newList = this.merge(key, this.list.data, newEntities);
      this.list = { data: newList, status: this._status(this.list.status, parentList.status) };
      this.subscriber?.next({ list: this.list.data.map(({ entity }) => entity), status: this.list.status });
      return resolve(this.list.status);
    });
  });

  readonly entities = new Observable<{ list: Entities<T, V>[], status: ListStatus; }>(subscriber => {
    console.log('+++ subscribing', this.stores);
    this.list = { data: [], status: undefined };
    this.subscriber = subscriber;
    this.reload();
    return () => {
      this.parentSubsctiption?.unsubscribe();
      this.parentSubsctiption = undefined;
      this.subscriber = null;
      this.list?.data.forEach(e => e.subscription.unsubscribe());
      this.list = null;
      console.log('xxx unsubscribed', this.stores);
    };
  }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private _populate(retrieved: Pick<V, keyof T>[]): PromiseLike<EntityWithSubscrition<T, V>[]> {
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

  exec(n: number, err: any, from?: Entities<T, V>, to?: Entities<T, V>): PromiseLike<ListStatus> {
    return (this.donePromises[n] || (this.donePromises[n] = this._exec(n, err, from, to)));
  }

  private _exec = (n: number, err: any, from?: Entities<T, V>, to?: Entities<T, V>): PromiseLike<ListStatus> => asAsync(function* () {
    let done: PromiseLike<ListStatus>[] = [];
    try {
      console.log('1', n, this.stores[this.key]);
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log('2', n, this.stores[this.key]);
      const oldList = n ? this.list.data : [];
      [from, to] = [from || oldList[0]?.entity, to || oldList[oldList.length - 1]?.entity];
      const retrieved = yield* wait(this.retrieve(from, to, err));
      console.log('3', n, this.stores[this.key]);
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log('4', n, this.stores[this.key]);
      const list = yield* wait(this._populate(retrieved.data));
      console.log('5', n, this.stores[this.key]);
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log('6', n, this.stores[this.key]);
      // if reload, unsubscribe from old entities
      if (!n) this.list.data.forEach(e => e.subscription.unsubscribe());
      this.list = { data: oldList.concat(list), status: retrieved.done };
      if (retrieved.done === undefined && this.parent) try {
        const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, null) : this.parentSubscriber());
        console.log('7u', n, this.stores[this.key], parentDone);
        return parentDone;
      } catch (e) {
        // unsubscribed while retrieving data from parent
        return true;
      } else {
        this.subscriber!.next({ list: this.list.data.map(e => e.entity), status: this.list.status });
        console.log('7', n, this.stores[this.key]);
        return retrieved.done;
      }
    } catch (e) {
      console.log('8', n, this.stores[this.key]);
      if (!this._setDone(n, done, this.list)) return yield* wait(done[0]);
      console.log('9', n, this.stores[this.key]);
      this.list.status = null;
      if (!this.parent) throw e;
      console.log('10', n, this.stores[this.key]);
      try {
        const parentDone = yield* wait(this.parentSubsctiption ? this.parent.exec(n, e) : this.parentSubscriber());
        console.log('11', n, this.stores[this.key], parentDone);
        return this._status(null, parentDone);
      } catch (e) {
        // unsubscribed while retrieving data from parent
        return true;
      }
    } finally {
      console.log('12', n, this.stores[this.key]);
      this.donePromises[n] = undefined;
    }
  }, this.promiseCtr, this)()
}

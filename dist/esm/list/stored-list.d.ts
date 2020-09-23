import { Subscription, Observable } from 'rxjs';
import { Entity } from '../entity';
import { Stores, Entities, EntitiesFlow, ListStatus, EntityList } from './types';
import { Keys, PromiseCtr, TRec } from '../common';
declare type EntityWithSubscrition<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = {
    entity: Entities<K, KK, T, V>;
    subscription: Subscription;
};
declare type Params<K extends string, ID extends Pick<any, K>, key extends K, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T = T, P extends T = never> = {
    /**
     * Retrieve function
     * @returns {PromiseLike<{ done?: boolean, data: V[]; }>} `done` is undefined means information is not available, check parent
     */
    retrieve: (first?: Entities<K, KK, T, any>, last?: Entities<K, KK, T, any>) => PromiseLike<{
        done?: boolean;
        data: V[];
    }>;
    stores: Stores<K, ID, KK, T, P, V>;
    key: key;
    keyof: <k extends K>(k: k, data: V[k]) => ID[k];
    keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], V[k]>) => ID[k];
    merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V>[], list2: EntityWithSubscrition<K, KK, T, V>[]) => EntityWithSubscrition<K, KK, T, V>[];
    parent?: EntityList<K, ID, KK, Pick<P, K>, any>;
    promiseCtr: PromiseCtr;
};
export declare class StoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, key extends K, T extends TRec<K, KK>, V extends T = T, P extends T = never> implements EntityList<K, ID, KK, T, V> {
    private parentSubsctiption?;
    private retrieve;
    /** list is null when `entities` has no subscription */
    private list;
    private subscriber;
    private donePromises;
    readonly key: key;
    readonly merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V>[], list2: EntityWithSubscrition<K, KK, T, V>[]) => EntityWithSubscrition<K, KK, T, V>[];
    readonly parent?: EntityList<K, ID, KK, Pick<P, K>, any>;
    readonly keys: Keys<K>;
    readonly stores: Stores<K, ID, KK, T, any, V>;
    readonly keyof: <k extends K>(k: k, data: V[k]) => ID[k];
    readonly keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], V[k]>) => ID[k];
    readonly promiseCtr: PromiseCtr;
    /**
     * @param {Params} params
     */
    constructor(params: Params<K, ID, key, KK, T, V, P>);
    add(entity: Entities<K, KK, T, V>): void;
    remove(entity: Entities<K, KK, T, V>): void;
    protected toPromise(flowList: EntitiesFlow<K, KK, T, V>[]): PromiseLike<EntityWithSubscrition<K, KK, T, V>[]>;
    private _status;
    private parentSubscriber;
    readonly entities: Observable<{
        list: Entities<K, KK, T, V>[];
        status: ListStatus;
    }>;
    private _populate;
    reload(err?: any): PromiseLike<ListStatus>;
    more(err?: any): PromiseLike<ListStatus>;
    private _setDone;
    exec(n: number, err: any, from?: Entities<K, KK, T, V>, to?: Entities<K, KK, T, V>): PromiseLike<ListStatus>;
    private _exec;
}
export {};

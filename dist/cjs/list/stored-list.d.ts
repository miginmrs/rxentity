import { Subscription, Observable } from 'rxjs';
import { Entity } from '../entity';
import { Stores, Entities, EntitiesFlow, ListStatus, EntityList } from './types';
import { Keys, PromiseCtr } from '../common';
declare type EntityWithSubscrition<T, V extends T> = {
    entity: Entities<T, V>;
    subscription: Subscription;
};
declare type Params<K extends Pick<any, keyof T>, key extends keyof T, T, V extends T = T, P extends T = never> = {
    /**
     * Retrieve function
     * @returns {PromiseLike<{ done?: boolean, data: V[]; }>} `done` is undefined means information is not available, check parent
     */
    retrieve: (first?: Entities<T, any>, last?: Entities<T, any>) => PromiseLike<{
        done?: boolean;
        data: V[];
    }>;
    stores: Stores<K, T, P, V>;
    key: key;
    keyof: <k extends keyof T>(k: k, data: V[k]) => K[k];
    keyofEntity: <k extends keyof T>(k: k, data: Entity<T[k], V[k]>) => K[k];
    merge: (key: key, list1: EntityWithSubscrition<T, V>[], list2: EntityWithSubscrition<T, V>[]) => EntityWithSubscrition<T, V>[];
    parent?: EntityList<K, Pick<P, keyof T>, any>;
    promiseCtr: PromiseCtr;
};
export declare class StoredList<K extends Pick<any, keyof T>, key extends keyof T, T, V extends T = T, P extends T = never> implements EntityList<K, T, V> {
    private parentSubsctiption?;
    private retrieve;
    /** list is null when `entities` has no subscription */
    private list;
    private subscriber;
    private donePromises;
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
    constructor(params: Params<K, key, T, V, P>);
    add(entity: Entities<T, V>): void;
    remove(entity: Entities<T, V>): void;
    protected toPromise(flowList: EntitiesFlow<T, V>[]): PromiseLike<EntityWithSubscrition<T, V>[]>;
    private _status;
    private parentSubscriber;
    readonly entities: Observable<{
        list: Entities<T, V>[];
        status: ListStatus;
    }>;
    private _populate;
    reload(err?: any): PromiseLike<ListStatus>;
    more(err?: any): PromiseLike<ListStatus>;
    private _setDone;
    exec(n: number, err: any, from?: Entities<T, V>, to?: Entities<T, V>): PromiseLike<ListStatus>;
    private _exec;
}
export {};

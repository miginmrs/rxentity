import { Subscription, Observable, Subscriber } from 'rxjs';
import { Entity } from '../entity';
import { Entities, EntitiesFlow, ListStatus, EntityList, AbstractEntities, AbstractStores, EntitiesImpl, TopStores, ChildEntitiesImpl, ChildStores } from './types';
import { Keys, PromiseCtr, TRec } from '../common';
declare type EntityWithSubscrition<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V> = AbstractEntities<K, KK, T, V>> = {
    entity: Entities<K, KK, T, V, impl>;
    subscription: Subscription;
};
export declare type Params<K extends string, ID extends Pick<any, K>, key extends K, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V>, stores extends AbstractStores<K, ID, KK, T, V, impl>> = {
    /**
     * Retrieve function
     * @returns {PromiseLike<{ done?: boolean, data: V[]; }>} `done` is undefined means information is not available, check parent
     */
    retrieve: (first?: Entities<K, KK, T, V, impl>, last?: Entities<K, KK, T, V, impl>) => PromiseLike<{
        done?: boolean;
        data: V[];
    }>;
    stores: stores;
    key: key;
    keyof: <k extends K>(k: k, data: V[k]) => ID[k];
    keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], any>) => ID[k];
    merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V, impl>[], list2: EntityWithSubscrition<K, KK, T, V, impl>[]) => EntityWithSubscrition<K, KK, T, V, impl>[];
    promiseCtr: PromiseCtr;
};
export declare abstract class AbstractStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, key extends K, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V>, stores extends AbstractStores<K, ID, KK, T, V, impl>> implements EntityList<K, ID, KK, T, V, impl> {
    protected parentSubsctiption?: Subscription;
    private retrieve;
    /** list is null when `entities` has no subscription */
    protected list: {
        data: EntityWithSubscrition<K, KK, T, V, impl>[];
        status: ListStatus;
    } | null;
    protected subscriber: Subscriber<{
        list: Entities<K, KK, T, V, impl>[];
        status: ListStatus;
    }> | null;
    private donePromises;
    readonly key: key;
    readonly merge: (key: key, list1: EntityWithSubscrition<K, KK, T, V, impl>[], list2: EntityWithSubscrition<K, KK, T, V, impl>[]) => EntityWithSubscrition<K, KK, T, V, impl>[];
    readonly keys: Keys<K>;
    readonly stores: stores;
    readonly keyof: <k extends K>(k: k, data: V[k]) => ID[k];
    readonly keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], any>) => ID[k];
    readonly promiseCtr: PromiseCtr;
    /**
     * @param {Params} params
     */
    constructor(params: Params<K, ID, key, KK, T, V, impl, stores>);
    add(entity: Entities<K, KK, T, V, impl>): void;
    remove(entity: Entities<K, KK, T, V, impl>): void;
    protected toPromise(flowList: EntitiesFlow<K, KK, T, V, impl>[]): PromiseLike<EntityWithSubscrition<K, KK, T, V, impl>[]>;
    protected _status(child: ListStatus, parent: ListStatus): ListStatus;
    readonly entities: Observable<{
        list: Entities<K, KK, T, V, impl>[];
        status: ListStatus;
    }>;
    private _populate;
    reload(err?: any): PromiseLike<ListStatus>;
    more(err?: any): PromiseLike<ListStatus>;
    private _setDone;
    exec(n: number, err: any, from?: Entities<K, KK, T, V, impl>, to?: Entities<K, KK, T, V, impl>): PromiseLike<ListStatus>;
    private _exec;
    abstract fromParent(n: number, process: () => boolean | undefined): Generator<any, ListStatus, any>;
    abstract handleError(n: number, error: any): Generator<any, ListStatus, any>;
}
export declare class TopStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, key extends K, T extends TRec<K, KK>, V extends T = T> extends AbstractStoredList<K, ID, KK, key, T, V, EntitiesImpl<K, KK, T, V>, TopStores<K, ID, KK, T, V>> {
    handleError(_n: number, e: any): Generator<never, ListStatus, unknown>;
    fromParent(_n: number, process: () => boolean | undefined): Generator<any, ListStatus, any>;
}
export declare class ChildStoredList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, key extends K, T extends TRec<K, KK>, V extends T, P extends T, pimpl extends AbstractEntities<K, KK, P, any>, stores extends ChildStores<K, ID, KK, T, V, P, pimpl, AbstractStores<K, ID, KK, P, any, pimpl>>, PL extends AbstractStoredList<K, ID, KK, key, P, any, pimpl, AbstractStores<K, ID, KK, P, any, pimpl>>> extends AbstractStoredList<K, ID, KK, key, T, V, ChildEntitiesImpl<K, KK, T, V, P, pimpl>, stores> {
    readonly parent: PL;
    constructor(params: Params<K, ID, key, KK, T, V, ChildEntitiesImpl<K, KK, T, V, P, pimpl>, stores> & {
        parent: PL;
    });
    private parentSubscriber;
    fromParent(n: number): Generator<boolean | PromiseLike<ListStatus> | null | undefined, boolean | null | undefined, ListStatus>;
    handleError(n: number, e: any): Generator<boolean | PromiseLike<ListStatus> | null | undefined, boolean | null | undefined, ListStatus>;
}
export {};

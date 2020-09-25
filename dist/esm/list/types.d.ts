import type { Observable, Subscription } from 'rxjs';
import { TRec } from '../common';
import type { EntityFlow, Entity, EntityAbstract, ChildEntityImpl, EntityImpl } from '../entity';
import type { AbstractStore, ChildStore, TopStore } from '../store';
export declare type Entities<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends {
    [k in K]: EntityAbstract<KK[k], T[k], V[k]>;
} = {
    [k in K]: EntityAbstract<KK[k], T[k], V[k]>;
}> = {
    [k in K]: Entity<KK[k], T[k], V[k], impl[k] & EntityAbstract<KK[k], T[k], V[k]>>;
};
export declare type EntitiesFlow<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends {
    [k in K]: EntityAbstract<KK[k], T[k], V[k]>;
} = {
    [k in K]: EntityAbstract<KK[k], T[k], V[k]>;
}> = {
    [k in K]: EntityFlow<KK[k], T[k], V[k], impl[k] & EntityAbstract<KK[k], T[k], V[k]>>;
};
export declare type AbstractEntities<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = {
    [k in K]: EntityAbstract<KK[k], T[k], V[k]>;
};
export declare type EntitiesImpl<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = {
    [k in K]: EntityImpl<KK[k], T[k], V[k]>;
};
export declare type ChildEntitiesImpl<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, P extends T, pimpl extends AbstractEntities<K, KK, P, any>> = {
    [k in K]: ChildEntityImpl<KK[k], T[k], V[k], P[k], pimpl[k] & EntityAbstract<KK[k], P[k], any>>;
};
export declare type ChildStores<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, P extends T, pimpl extends AbstractEntities<K, KK, P, any>, PS extends AbstractStores<K, ID, KK, P, any, pimpl>> = {
    [k in K]: ChildStore<ID[k], KK[k], T[k], V[k], P[k], pimpl[k] & EntityAbstract<KK[k], P[k], any>, PS[k] & AbstractStore<ID[k], KK[k], P[k], any, pimpl[k] & EntityAbstract<KK[k], P[k], any>>>;
};
export declare type TopStores<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = {
    [k in K]: TopStore<ID[k], KK[k], T[k], V[k]>;
};
export declare type AbstractStores<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T, impl extends AbstractEntities<K, KK, T, V>> = {
    [k in K]: AbstractStore<ID[k], KK[k], T[k], V[k], impl[k] & EntityAbstract<KK[k], T[k], V[k]>>;
};
/**
 * The status of the completude of the list:
 * * `true` means done
 * * `false` means there is more
 * * `undefined` means unknown state, need to check parent (temporary in general)
 * * `null` means erronous state, need to retry
 */
export declare type ListStatus = boolean | null | undefined;
export interface EntityList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T = T, impl extends AbstractEntities<K, KK, T, V> = AbstractEntities<K, KK, T, V>> {
    readonly entities: Observable<{
        list: Entities<K, KK, T, V, impl>[];
        status: ListStatus;
    }>;
    readonly reloadPromise?: PromiseLike<ListStatus>;
    readonly morePromise?: PromiseLike<ListStatus>;
    exec(n: number, err: any, from?: Entities<K, KK, T, V, impl>, to?: Entities<K, KK, T, V, impl>): PromiseLike<ListStatus>;
    reload(err?: any): PromiseLike<ListStatus>;
    more(err?: any): PromiseLike<ListStatus>;
    keyof: <k extends K>(k: k, data: V[k]) => ID[k];
    keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], V[k], impl[k] & EntityAbstract<KK[k], T[k], V[k]>>) => ID[k];
    add(entity: Entities<K, KK, T, V, impl>, subscription: Subscription): void;
    remove(entity: Entities<K, KK, T, V, impl>): void;
}

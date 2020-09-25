import { Observable, Subscriber, Subscription, Subject } from 'rxjs';
import { PromiseCtr, Rec } from './common';
import { EntityFlow, Entity, ChildEntityImpl, EntityImpl, EntityAbstract } from "./entity";
interface IStore<ID, K extends string, T extends Rec<K>, V extends T> {
    get(id: ID, skipCurrent?: true): EntityFlow<K, T, V>;
}
declare type Item<ID, K extends string, T extends Rec<K>, V extends T, impl extends EntityAbstract<K, T, V>> = {
    id: ID;
    observers: Subscriber<Entity<K, T, V>>[];
    entity?: Entity<K, T, V, impl>;
    next?: PromiseLike<void>;
    parentSubscription?: Subscription;
    closed?: true;
    ready?: true;
};
export declare abstract class AbstractStore<ID, K extends string, T extends Rec<K>, V extends T, impl extends EntityAbstract<K, T, V>> implements IStore<ID, K, T, V> {
    readonly name: string;
    private finalize;
    readonly promiseCtr: PromiseCtr;
    protected _items: Map<ID, Item<ID, K, T, V, impl>>;
    readonly insersions: Subject<ID[]>;
    readonly emptyInsersions: Subject<ID>;
    constructor(name: string, finalize: (id: ID, entity: Entity<K, T, V, impl>) => void, promiseCtr: PromiseCtr);
    rewind(id: ID): void;
    /**
     * Ensures the existance of an entity with a givin id using a givin construction logic
     * @param id id of the item to be prepared
     * @param handler the asynchronous function to be executed in order to prepare the item
     * @returns an observable that holds the logic behind the entity construction
     */
    prepare(id: ID, handler: (id: ID, item: {
        readonly ready?: true;
    }, join: (subsciption: Subscription) => void) => void | PromiseLike<void>): Observable<Entity<K, T, V, impl>>;
    nextBulk(items: {
        id: ID;
        data: V;
    }[]): void;
    next(id: ID, data: V): void;
    private _next;
    abstract setItemEntity(id: ID, data: V, item: Item<ID, K, T, V, impl>): void;
    abstract linkParentNewId(oldId: ID, newId: ID, item: Item<ID, K, T, V, impl>): void;
    abstract subscribeToParent(id: ID, item: Item<ID, K, T, V, impl>, skipCurrent?: true): void;
    updateId(oldId: ID, newId: ID): void;
    update<M extends K>(id: ID, data: Pick<V, M>): void;
    private item;
    get(id: ID, skipCurrent?: true): EntityFlow<K, T, V, impl>;
}
export declare class ChildStore<ID, K extends string, T extends Rec<K>, V extends T, P extends T, pimpl extends EntityAbstract<K, P, any>, PS extends AbstractStore<ID, K, P, any, pimpl>> extends AbstractStore<ID, K, T, V, ChildEntityImpl<K, T, V, P, pimpl>> {
    readonly parent: PS;
    constructor(name: string, finalize: (id: ID, entity: Entity<K, T, V, ChildEntityImpl<K, T, V, P, pimpl>>) => void, promiseCtr: PromiseCtr, parent: PS);
    setItemEntity(id: ID, data: V, item: Item<ID, K, T, V, ChildEntityImpl<K, T, V, P, pimpl>>): void;
    linkParentNewId(_oldId: ID, newId: ID, item: Item<ID, K, T, V, ChildEntityImpl<K, T, V, P, pimpl>>): void;
    subscribeToParent(id: ID, item: Item<ID, K, T, V, ChildEntityImpl<K, T, V, P, pimpl>>, skipCurrent?: true): void;
}
export declare class TopStore<ID, K extends string, T extends Rec<K>, V extends T = T> extends AbstractStore<ID, K, T, V, EntityImpl<K, T, V>> {
    constructor(name: string, finalize: (id: ID, entity: Entity<K, T, V, EntityImpl<K, T, V>>) => void, promiseCtr: PromiseCtr);
    setItemEntity(_id: ID, data: V, item: Item<ID, K, T, V, EntityImpl<K, T, V>>): void;
    linkParentNewId(): void;
    subscribeToParent(): void;
}
export {};

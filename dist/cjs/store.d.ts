import { Observable, Subscription, Subject } from 'rxjs';
import { PromiseCtr, Rec } from './common';
import { EntityFlow, Entity, ChildEntityImpl, EntityAbstract } from "./entity";
interface IStore<ID, K extends string, T extends Rec<K>, V extends T> {
    get(id: ID, skipCurrent?: true): EntityFlow<K, T, V>;
}
export declare type DepEntityImpl<K extends string, T extends Rec<K>, P extends T, V extends T> = never extends P ? EntityAbstract<K, T, V> : ChildEntityImpl<K, T, P, V, never, Entity<K, P, any, any>>;
export declare class Store<ID, K extends string, T extends Rec<K>, P extends T = never, V extends T = T, impl extends DepEntityImpl<K, T, P, V> = DepEntityImpl<K, T, P, V>> implements IStore<ID, K, T, V> {
    readonly name: string;
    private finalize;
    readonly promiseCtr: PromiseCtr;
    readonly parent: IStore<ID, K, P, any> | null;
    private _items;
    readonly insersions: Subject<ID[]>;
    readonly emptyInsersions: Subject<ID>;
    constructor(name: string, finalize: (id: ID, entity: Entity<K, T, V>) => void, promiseCtr: PromiseCtr, parent?: IStore<ID, K, P, any> | null);
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
    updateId(oldId: ID, newId: ID): void;
    update<M extends K>(id: ID, data: Pick<V, M>): void;
    private item;
    get(id: ID, skipCurrent?: true): EntityFlow<K, T, V, impl>;
}
export {};

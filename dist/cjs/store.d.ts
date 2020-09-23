import { Observable, Subscription, Subject } from 'rxjs';
import { KeyOf, PromiseCtr } from './common';
import { EntityFlow, Entity } from "./entity";
interface IStore<K, T, V extends T> {
    get(id: K, skipCurrent?: true): EntityFlow<T, V>;
}
export declare class Store<K, T, P extends T = never, V extends T = T> implements IStore<K, T, V> {
    readonly name: string;
    private finalize;
    readonly promiseCtr: PromiseCtr;
    readonly parent: IStore<K, P, any> | null;
    private _items;
    readonly insersions: Subject<K[]>;
    readonly emptyInsersions: Subject<K>;
    constructor(name: string, finalize: (id: K, entity: Entity<T, V>) => void, promiseCtr: PromiseCtr, parent?: IStore<K, P, any> | null);
    rewind(id: K): void;
    /**
     * Ensures the existance of an entity with a givin id using a givin construction logic
     * @param id id of the item to be prepared
     * @param handler the asynchronous function to be executed in order to prepare the item
     * @returns an observable that holds the logic behind the entity construction
     */
    prepare(id: K, handler: (id: K, item: {
        readonly ready?: true;
    }, join: (subsciption: Subscription) => void) => void | PromiseLike<void>): Observable<Entity<T, V>>;
    nextBulk(items: {
        id: K;
        data: V;
    }[]): void;
    next(id: K, data: V): void;
    private _next;
    updateId(oldId: K, newId: K): void;
    update<M extends KeyOf<T>>(id: K, data: Pick<V, M>): void;
    private item;
    get(id: K, skipCurrent?: true): EntityFlow<T, V>;
}
export {};

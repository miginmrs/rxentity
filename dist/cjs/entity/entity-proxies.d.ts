import { Observable } from "rxjs";
import { KeyOf } from "../common";
import { EntityAbstract } from "./entity-abstract";
import { ValuedSubject } from "../valued-observable";
/**
 * Proxified entity type
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare type Entity<T, V extends T, E = EntityAbstract<T, V>> = E & {
    readonly [k in Exclude<KeyOf<T>, keyof E>]: ValuedSubject<T[k], V[k]>;
};
/**
 * Proxified entity observable, subscribing to it keeps entity in the store
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare type EntityFlow<T, V extends T> = {
    readonly [k in Exclude<KeyOf<T>, 'observable' | 'field' | 'unsubscribe'>]: Observable<T[k]>;
} & {
    observable: Observable<Entity<T, V>>;
    field: {
        readonly [k in KeyOf<T>]: Observable<T[k]>;
    };
};
/**
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
export declare const entityFlow: <T, V extends T>(observable: Observable<Entity<T, V, EntityAbstract<T, V>>>, field?: EntityFlow<T, V>["field"] | undefined) => EntityFlow<T, V>;
/**
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
export declare const toEntity: <T, V extends T, E extends EntityAbstract<T, V>>(entity: EntityAbstract<T, V> & E) => Entity<T, V, E>;

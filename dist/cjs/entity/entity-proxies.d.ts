import { Observable } from "rxjs";
import { EntityAbstract } from "./entity-abstract";
import { ValuedSubject } from "rxvalue";
import { Rec } from "../common";
declare const $entity: unique symbol;
/**
 * Proxified entity type
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare type Entity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>> = {
    readonly [$entity]: E;
} & {
    readonly [k in K]: ValuedSubject<T[k], V[k]>;
};
export declare function getEntity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(e: Entity<K, T, V, S, E>): E;
export declare function getEntity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(e: Entity<K, T, V, S, E> | undefined): E | undefined;
/**
 * Proxified entity observable, subscribing to it keeps entity in the store
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare type EntityFlow<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>> = {
    readonly [k in Exclude<K, 'observable' | 'field' | 'unsubscribe'>]: Observable<T[k]>;
} & {
    observable: Observable<Entity<K, T, V, S, E>>;
    field: {
        readonly [k in K]: Observable<T[k]>;
    };
};
/**
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
export declare const entityFlow: <K extends string, T extends Partial<Record<K, any>>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>>(observable: Observable<Entity<K, T, V, S, E>>, field?: EntityFlow<K, T, V, S, E>["field"] | undefined) => EntityFlow<K, T, V, S, E>;
/**
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
export declare const toEntity: <K extends string, T extends Partial<Record<K, any>>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(entity: EntityAbstract<K, T, V, S> & E) => Entity<K, T, V, S, E>;
export declare const $rx: <K extends string, T extends Partial<Record<K, any>>, V extends T, k extends K>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>, k: k) => ValuedSubject<T[k], V[k]>;
export declare const $rxMap: <K extends string, T extends Partial<Record<K, any>>, V extends T>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>) => Readonly<import("./entity-abstract").EntityFieldsMap<K, T, V>>;
export declare const $levelOf: <K extends string, T extends Partial<Record<K, any>>, V extends T, k extends K>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>, k: k) => Observable<number> & {
    value: number;
};
export declare const $rewind: <K extends string, T extends Partial<Record<K, any>>, V extends T, k extends K>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>, k?: k | undefined) => void;
export declare const $update: <K extends string, T extends Partial<Record<K, any>>, V extends T, SK extends K>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>, e: { [k in SK]: V[k]; }) => void;
export declare const $snapshot: <K extends string, T extends Partial<Record<K, any>>, V extends T>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>) => Pick<T, K>;
export declare const $local: <K extends string, T extends Partial<Record<K, any>>, V extends T>(entity: Entity<K, T, V, any, EntityAbstract<K, T, V, any>>) => Partial<Pick<T, K>>;
export {};

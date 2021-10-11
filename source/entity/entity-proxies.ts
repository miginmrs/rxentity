import { alternMap } from "altern-map";
import { Observable } from "rxjs";
import { EntityAbstract, LinkedValuedSubject } from "./entity-abstract";
import { Rec } from "../common";

declare const $entity: unique symbol;
const entities = new WeakMap<Entity<any, any, any, any>, EntityAbstract<any, any, any, any>>();
/** 
 * Proxified entity type
 * @template T map of fields output types
 * @template V map of fields input types
 */
export type Entity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>> = { readonly [$entity]: E, } & {
  readonly [k in K]: LinkedValuedSubject<T[k], V[k]>
};

export function getEntity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(e: Entity<K, T, V, S, E>): E;
export function getEntity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(e: Entity<K, T, V, S, E> | undefined): E | undefined;
export function getEntity<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(e?: Entity<K, T, V, S, E>): E | undefined {
  if (!e) return;
  return entities.get(e) as E;
}

/** 
 * Proxified entity observable, subscribing to it keeps entity in the store
 * @template T map of fields output types
 * @template V map of fields input types
 */
export type EntityFlow<K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>> = {
  readonly [k in Exclude<K, 'observable' | 'field' | 'unsubscribe'>]: Observable<T[k]>;
} & {
  observable: Observable<Entity<K, T, V, S, E>>;
  field: { readonly [k in K]: Observable<T[k]> };
};

/** Extracts the field observable from the entity flow */
const fieldRX = <K extends string, T extends Rec<K>, V extends T, S, k extends K>(entity: Observable<Entity<K, T, V, S>>, field: k): Observable<T[k]> => {
  return entity.pipe(alternMap(e => getEntity(e).rx(field)));
};

/** 
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
export const entityFlow = <K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S> = EntityAbstract<K, T, V, S>>(
  observable: Observable<Entity<K, T, V, S, E>>,
  field?: EntityFlow<K, T, V, S, E>['field']
): EntityFlow<K, T, V, S, E> => new Proxy({} as any as EntityFlow<K, T, V, S, E>, {
  get(_target: EntityFlow<K, T, V, S, E>, key: keyof EntityFlow<K, T, V, S, E>) {
    if (key === 'observable') return observable;
    if (key === 'field') return field || (field = new Proxy({} as EntityFlow<K, T, V, S>['field'], {
      get<k extends K>(_: EntityFlow<K, T, V, S>['field'], k: k) { return fieldRX(observable, k); }
    }));
    return fieldRX(observable, key);
  }
});


/** 
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
export const toEntity = <K extends string, T extends Rec<K>, V extends T, S, E extends EntityAbstract<K, T, V, S>>(entity: EntityAbstract<K, T, V, S> & E) => {
  const proxy = new Proxy<Entity<K, T, V, S, E>>(Object.prototype as Entity<K, T, V, S, E>, {
    get(_, key: K) {
      return entity.rx(key);
    },
    ownKeys() {
      return Object.keys(entity.rxMap)
    }
  });
  entities.set(proxy, entity);
  return proxy;
};


export const $rx = <K extends string, T extends Rec<K>, V extends T, k extends K>(entity: Entity<K, T, V, any>, k: k) => getEntity(entity).rx(k);
export const $rxMap = <K extends string, T extends Rec<K>, V extends T>(entity: Entity<K, T, V, any>) => getEntity(entity).rxMap;
export const $levelOf = <K extends string, T extends Rec<K>, V extends T, k extends K>(entity: Entity<K, T, V, any>, k: k) => getEntity(entity).levelOf(k);
export const $rewind = <K extends string, T extends Rec<K>, V extends T, k extends K>(entity: Entity<K, T, V, any>, k?: k) => getEntity(entity).rewind(k);
export const $update = <K extends string, T extends Rec<K>, V extends T, SK extends K>(entity: Entity<K, T, V, any>, e: { [k in SK]: V[k] }) => getEntity(entity).update(e);
export const $snapshot = <K extends string, T extends Rec<K>, V extends T>(entity: Entity<K, T, V, any>) => getEntity(entity).snapshot;
export const $local = <K extends string, T extends Rec<K>, V extends T>(entity: Entity<K, T, V, any>) => getEntity(entity).local;


import { alternMap } from "altern-map";
import { Observable } from "rxjs";
import { guard, KeyOf } from "../common";
import { EntityAbstract } from "./entity-abstract";
import { ValuedSubject } from "../valued-observable";

declare const $entity: unique symbol;
const entities = new WeakMap<Entity<any, any>, EntityAbstract<any, any>>();
/** 
 * Proxified entity type
 * @template T map of fields output types
 * @template V map of fields input types
 */
export type Entity<T, V extends T, E extends EntityAbstract<T, V> = EntityAbstract<T, V>> = { readonly [$entity]: E, } & {
  readonly [k in KeyOf<T>]: ValuedSubject<T[k], V[k]>
};

export function getEntity<T, V extends T, E extends EntityAbstract<T, V>>(e: Entity<T, V, E>): E;
export function getEntity<T, V extends T, E extends EntityAbstract<T, V>>(e: Entity<T, V, E> | undefined): E | undefined;
export function getEntity<T, V extends T, E extends EntityAbstract<T, V>>(e?: Entity<T, V, E>): E | undefined {
  if (!e) return;
  return entities.get(e) as E;
}

/** 
 * Proxified entity observable, subscribing to it keeps entity in the store
 * @template T map of fields output types
 * @template V map of fields input types
 */
export type EntityFlow<T, V extends T> = {
  readonly [k in Exclude<KeyOf<T>, 'observable' | 'field' | 'unsubscribe'>]: Observable<T[k]>;
} & {
  observable: Observable<Entity<T, V>>;
  field: { readonly [k in KeyOf<T>]: Observable<T[k]> };
};

/** Extracts the field observable from the entity flow */
const fieldRX = <T, V extends T, K extends KeyOf<T>>(entity: Observable<Entity<T, V>>, field: K): Observable<T[K]> => {
  return entity.pipe(alternMap(e => getEntity(e).rx(field)));
};

/** 
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
export const entityFlow = <T, V extends T>(
  observable: Observable<Entity<T, V>>,
  field?: EntityFlow<T, V>['field']
): EntityFlow<T, V> => new Proxy({} as any as EntityFlow<T, V>, {
  get(_target: EntityFlow<T, V>, key: keyof EntityFlow<T, V>) {
    if (key === 'observable') return observable;
    if (key === 'field') return field || (field = new Proxy({} as EntityFlow<T, V>['field'], {
      get<k extends KeyOf<T>>(_: EntityFlow<T, V>['field'], k: k) { return fieldRX(observable, k); }
    }));
    return fieldRX(observable, key);
  }
});


/** 
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
export const toEntity = <T, V extends T, E extends EntityAbstract<T, V>>(entity: EntityAbstract<T, V> & E) => {
  const proxy = new Proxy<Entity<T, V, E>>(Object.prototype as Entity<T, V, E>, {
    get(_, key: KeyOf<T>) {
      return entity.rx(key);
    },
    ownKeys() {
      return Object.keys(entity.rxMap)
    }
  });
  entities.set(proxy, entity);
  return proxy;
};


export const $rx = <T, V extends T, k extends KeyOf<T>>(entity: Entity<T, V>, k: k) => getEntity(entity).rx(k);
export const $rxMap = <T, V extends T>(entity: Entity<T, V>) => getEntity(entity).rxMap;
export const $levelOf = <T, V extends T, k extends KeyOf<T>>(entity: Entity<T, V>, k: k) => getEntity(entity).levelOf(k);
export const $rewind = <T, V extends T, k extends KeyOf<T>>(entity: Entity<T, V>, k?: k) => getEntity(entity).rewind(k);
export const $update = <T, V extends T, K extends KeyOf<T>>(entity: Entity<T, V>, e: { [k in K]: V[k] }) => getEntity(entity).update(e);
export const $snapshot = <T, V extends T>(entity: Entity<T, V>) => getEntity(entity).snapshot;
export const $local = <T, V extends T>(entity: Entity<T, V>) => getEntity(entity).local;


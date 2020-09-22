import { alternMap } from "altern-map";
import { Observable } from "rxjs";
import { guard, KeyOf } from "../common";
import { EntityAbstract } from "./entity-abstract";
import { ValuedSubject } from "../valued-observable";

/** 
 * Proxified entity type
 * @template T map of fields output types
 * @template V map of fields input types
 */
export type Entity<T, V extends T, E = EntityAbstract<T, V>> = E & {
  readonly [k in Exclude<KeyOf<T>, keyof E>]: ValuedSubject<T[k], V[k]>
};

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
  return entity.pipe(alternMap(e => e.rx(field)));
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
export const toEntity = <T, V extends T, E extends EntityAbstract<T, V>>(entity: EntityAbstract<T, V> & E) => new Proxy<Entity<T, V, E>>(entity as Entity<T, V, E>, {
  get(target, key: keyof Entity<T, V, E>) {
    const k: keyof any = key;
    return guard<typeof key, keyof E>(key, k in entity) ? target[key] : target.rx(key);
  }
});

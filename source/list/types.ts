import type { Observable, Subscription } from 'rxjs';
import type { EntityFlow, Entity } from '../entity';
import type { Store } from '../store';

export type Entities<K extends string, T extends Record<K, any>, V extends T> = { [k in K]: Entity<T[k], V[k]> };
export type EntitiesFlow<K extends string, T extends Record<K, any>, V extends T> = { [k in K]: EntityFlow<T[k], V[k]>; };
export type Stores<K extends string, ID extends Pick<any, K>, T extends Record<K, any>, P extends T = never, V extends T = T> = { [k in K]: Store<ID[k], T[k], P[k], V[k]> };

/**
 * The status of the completude of the list:
 * * `true` means done
 * * `false` means there is more
 * * `undefined` means unknown state, need to check parent (temporary in general)
 * * `null` means erronous state, need to retry
 */
export type ListStatus = boolean | null | undefined;

export interface EntityList<K extends string, ID extends Pick<any, K>, T extends Record<K, any>, V extends T = T> {
  readonly entities: Observable<{ list: Entities<K, T, V>[], status: ListStatus; }>;
  readonly reloadPromise?: PromiseLike<ListStatus>;
  readonly morePromise?: PromiseLike<ListStatus>;
  exec(n: number, err: any, from?: Entities<K, T, V>, to?: Entities<K, T, V>): PromiseLike<ListStatus>;
  reload(err?: any): PromiseLike<ListStatus>;
  more(err?: any): PromiseLike<ListStatus>;
  keyof: <k extends K>(k: k, data: V[k]) => ID[k];
  keyofEntity: <k extends K>(k: k, data: Entity<T[k], V[k]>) => ID[k];
  add(entity: Entities<K, T, V>, subscription: Subscription): void;
  remove(entity: Entities<K, T, V>): void;
}

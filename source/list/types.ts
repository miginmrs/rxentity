import type { Observable, Subscription } from 'rxjs';
import { TRec } from '../common';
import type { EntityFlow, Entity } from '../entity';
import type { Store } from '../store';

export type Entities<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = { [k in K]: Entity<KK[k], T[k], V[k]> };
export type EntitiesFlow<K extends string, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T> = { [k in K]: EntityFlow<KK[k], T[k], V[k]>; };
export type Stores<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, P extends T = never, V extends T = T> = { [k in K]: Store<ID[k], KK[k], T[k], P[k], V[k]> };

/**
 * The status of the completude of the list:
 * * `true` means done
 * * `false` means there is more
 * * `undefined` means unknown state, need to check parent (temporary in general)
 * * `null` means erronous state, need to retry
 */
export type ListStatus = boolean | null | undefined;

export interface EntityList<K extends string, ID extends Pick<any, K>, KK extends Record<K, string>, T extends TRec<K, KK>, V extends T = T> {
  readonly entities: Observable<{ list: Entities<K, KK, T, V>[], status: ListStatus; }>;
  readonly reloadPromise?: PromiseLike<ListStatus>;
  readonly morePromise?: PromiseLike<ListStatus>;
  exec(n: number, err: any, from?: Entities<K, KK, T, V>, to?: Entities<K, KK, T, V>): PromiseLike<ListStatus>;
  reload(err?: any): PromiseLike<ListStatus>;
  more(err?: any): PromiseLike<ListStatus>;
  keyof: <k extends K>(k: k, data: V[k]) => ID[k];
  keyofEntity: <k extends K>(k: k, data: Entity<KK[k], T[k], V[k]>) => ID[k];
  add(entity: Entities<K, KK, T, V>, subscription: Subscription): void;
  remove(entity: Entities<K, KK, T, V>): void;
}

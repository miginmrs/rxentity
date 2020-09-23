import type { Observable, Subscription } from 'rxjs';
import type { EntityFlow, Entity } from '../entity';
import type { Store } from '../store';

export type Entities<T, V extends T> = { [k in keyof T]: Entity<T[k], V[k]> };
export type EntitiesFlow<T, V extends T> = { [k in keyof T]: EntityFlow<T[k], V[k]>; };
export type Stores<K extends Pick<any, keyof T>, T, P extends T = never, V extends T = T> = { [k in keyof T]: Store<K[k], T[k], P[k], V[k]> };


/**
 * The status of the completude of the list:
 * * `true` means done
 * * `false` means there is more
 * * `undefined` means unknown state, need to check parent (temporary in general)
 * * `null` means erronous state, need to retry
 */
export type ListStatus = boolean | null | undefined;

export interface EntityList<K extends Pick<any, keyof T>, T, V extends T = T> {
    readonly entities: Observable<{ list: Entities<T, V>[], status: ListStatus; }>;
    readonly reloadPromise?: PromiseLike<ListStatus>;
    readonly morePromise?: PromiseLike<ListStatus>;
    exec(n: number, err: any, from?: Entities<T, V>, to?: Entities<T, V>): PromiseLike<ListStatus>;
    reload(err?: any): PromiseLike<ListStatus>;
    more(err?: any): PromiseLike<ListStatus>;
    keyof: <k extends keyof T>(k: k, data: V[k]) => K[k];
    keyofEntity: <k extends keyof T>(k: k, data: Entity<T[k], V[k]>) => K[k];
    add(entity: Entities<T, V>, subscription: Subscription): void;
    remove(entity: Entities<T, V>): void;
  }
  
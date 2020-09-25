import { combineLatest, of as rxof, Observable, UnaryFunction, OperatorFunction, ObservedValueOf } from 'rxjs';

export type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & { next: (value: V) => void; };


import { distinctUntilChanged, map as rxmap, tap } from 'rxjs/operators';
import { alternMap } from 'altern-map';

export type ValuedObservable<T> = Observable<T> & { readonly value: T; };
export const of = <T>(value: T) => Object.assign(rxof(value), { value });
export const map = <T, R>(o: ValuedObservable<T>, p: (v: T) => R): ValuedObservable<R> => Object.defineProperty(
  o.pipe(rxmap(p)), 'value', { get: () => p(o.value) }
);
export const distinct = <T>(o: ValuedObservable<T>, eq?: (a: T, b: T) => boolean): ValuedObservable<T> => Object.defineProperty(
  o.pipe(distinctUntilChanged(eq)), 'value', { get: () => o.value }
);
export const altern = <T, R>(o: ValuedObservable<T>, p: (v: T) => ValuedObservable<R>): ValuedObservable<R> => Object.defineProperty(
  o.pipe(alternMap(p)), 'value', { get: () => p(o.value).value }
);
export const combine = <O extends ValuedObservable<any>>(sources: O[]): ValuedObservable<ObservedValueOf<O>[]> => Object.defineProperty(
  combineLatest(sources), 'value', { get: () => sources.map(s => s.value) }
);
export const pipe = <T>(o: ValuedObservable<T>, op: OperatorFunction<T, T>): ValuedObservable<T> => Object.defineProperty(
  o.pipe(op), 'value', { get: () => o.value }
);
export const fromPromise = <T>(p: PromiseLike<T>, value: T) => {
  const observable = new Observable<T>(subs => {
    let done = false;
    subs.next(value);
    p.then(v => {
      if (!done) subs.next(value = v);
      subs.complete();
    }, err => subs.error(err));
    return () => { done = true; };
  });
  return observable as ValuedObservable<T>;
};
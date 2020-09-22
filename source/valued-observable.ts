import { Observable, UnaryFunction, OperatorFunction, ObservedValueOf } from 'rxjs';

export type ValuedObservable<T> = Observable<T> & ValuedObservableInterface<T>;
export type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & { next: (value: V) => void; };

declare const value: unique symbol;
export interface ValuedObservableInterface<T> { [value]: T; }

export function current<T>(obs: Observable<T>, value: T): T;
export function current<T>(obs: ValuedObservable<T>): T;
export function current<T>(obs: Observable<T> & { value?: T; }, value?: T) {
  if ('value' in obs) return obs.value;
  obs.subscribe(v => value = v).unsubscribe();
  return value!;
};

declare module 'rxjs' {
  interface BehaviorSubject<T> extends ValuedObservableInterface<T> { }
  interface Observable<T> {
    pipe(this: ValuedObservable<T>): ValuedObservable<T>;
    pipe<A>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>): ValuedObservable<A>;
    pipe<A, B>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>): ValuedObservable<B>;
    pipe<A, B, C>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>): ValuedObservable<C>;
    pipe<A, B, C, D>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>): ValuedObservable<D>;
    pipe<A, B, C, D, E>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>): ValuedObservable<E>;
    pipe<A, B, C, D, E, F>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>): ValuedObservable<F>;
    pipe<A, B, C, D, E, F, G>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>): ValuedObservable<G>;
    pipe<A, B, C, D, E, F, G, H>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>): ValuedObservable<H>;
    pipe<A, B, C, D, E, F, G, H, I>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>, op9: ValuedOperatorFunction<H, I>): ValuedObservable<I>;
    pipe<A, B, C, D, E, F, G, H, I>(this: ValuedObservable<T>, op1: ValuedOperatorFunction<T, A>, op2: ValuedOperatorFunction<A, B>, op3: ValuedOperatorFunction<B, C>, op4: ValuedOperatorFunction<C, D>, op5: ValuedOperatorFunction<D, E>, op6: ValuedOperatorFunction<E, F>, op7: ValuedOperatorFunction<F, G>, op8: ValuedOperatorFunction<G, H>, op9: ValuedOperatorFunction<H, I>, ...operations: ValuedOperatorFunction<any, any>[]): ValuedObservable<{}>;
  }
}
export interface ValuedOperatorFunction<T, R> extends
  UnaryFunction<ValuedObservable<T>, ValuedObservable<R>>,
  OperatorFunction<T, R> { }
declare module 'rxjs/internal/observable/of' {
  function of<T>(a: T): ValuedObservable<T>;
}
declare module 'rxjs/internal/operators/map' {
  function map<T, R>(project: (value: T, index: number) => R, thisArg?: any): ValuedOperatorFunction<T, R>;
}
declare module 'rxjs/internal/operators/switchMap' {
  function switchMap<T, O extends ValuedObservable<any>>(project: (value: T, index: number) => O): ValuedOperatorFunction<T, ObservedValueOf<O>>;
}
declare module 'rxjs/internal/observable/combineLatest' {
  function combineLatest<O1 extends ValuedObservable<any>>(sources: [O1]): ValuedObservable<[ObservedValueOf<O1>]>;
  function combineLatest<O1 extends ValuedObservable<any>, O2 extends ValuedObservable<any>>(sources: [O1, O2]): ValuedObservable<[ObservedValueOf<O1>, ObservedValueOf<O2>]>;
  function combineLatest<O1 extends ValuedObservable<any>, O2 extends ValuedObservable<any>, O3 extends ValuedObservable<any>>(sources: [O1, O2, O3]): ValuedObservable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>;
  function combineLatest<O1 extends ValuedObservable<any>, O2 extends ValuedObservable<any>, O3 extends ValuedObservable<any>, O4 extends ValuedObservable<any>>(sources: [O1, O2, O3, O4]): ValuedObservable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>;
  function combineLatest<O1 extends ValuedObservable<any>, O2 extends ValuedObservable<any>, O3 extends ValuedObservable<any>, O4 extends ValuedObservable<any>, O5 extends ValuedObservable<any>>(sources: [O1, O2, O3, O4, O5]): ValuedObservable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]>;
  function combineLatest<O1 extends ValuedObservable<any>, O2 extends ValuedObservable<any>, O3 extends ValuedObservable<any>, O4 extends ValuedObservable<any>, O5 extends ValuedObservable<any>, O6 extends ValuedObservable<any>>(sources: [O1, O2, O3, O4, O5, O6]): ValuedObservable<[ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>, ObservedValueOf<O6>]>;
  function combineLatest<O extends ValuedObservable<any>>(sources: O[]): ValuedObservable<ObservedValueOf<O>[]>;
}
declare module 'altern-map' {
  function alternMap<T, O extends ValuedObservable<any>>(project: (value: T, index: number) => O): ValuedOperatorFunction<T, ObservedValueOf<O>>;
}
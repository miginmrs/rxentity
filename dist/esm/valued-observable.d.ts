import { Observable, OperatorFunction, ObservedValueOf } from 'rxjs';
export declare type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & {
    next: (value: V) => void;
};
export declare type ValuedObservable<T> = Observable<T> & {
    readonly value: T;
};
export declare const of: <T>(value: T) => Observable<T> & {
    value: T;
};
export declare const map: <T, R>(o: ValuedObservable<T>, p: (v: T) => R) => ValuedObservable<R>;
export declare const distinct: <T>(o: ValuedObservable<T>, eq?: ((a: T, b: T) => boolean) | undefined) => ValuedObservable<T>;
export declare const altern: <T, R>(o: ValuedObservable<T>, p: (v: T) => ValuedObservable<R>) => ValuedObservable<R>;
export declare const combine: <O extends ValuedObservable<any>>(sources: O[]) => ValuedObservable<ObservedValueOf<O>[]>;
export declare const pipe: <T>(o: ValuedObservable<T>, op: OperatorFunction<T, T>) => ValuedObservable<T>;
export declare const fromPromise: <T>(p: Promise<T>, value: T) => ValuedObservable<T>;

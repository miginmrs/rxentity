import { Observable, of as rxOf, map as rxMap } from 'rxjs';

/**
 * An observable that always has a current value, in the same way a
 * `BehaviorSubject` does. `.value` is part of the type: a plain `Observable`
 * is not a `ValuedObservable`.
 */
export type ValuedObservable<T> = Observable<T> & { readonly value: T };

/** A {@link ValuedObservable} that accepts new values. */
export type ValuedSubject<T, V extends T = T> = ValuedObservable<T> & {
  next: (value: V) => void;
};

/**
 * Install `.value` on an observable. This is the one place the current-value
 * property is added; afterwards the type guarantees it is there.
 */
export function withValue<T>(observable: Observable<T>, read: () => T): ValuedObservable<T> {
  Object.defineProperty(observable, 'value', { get: read });
  return observable as ValuedObservable<T>;
}

/** `rxjs.of` plus the value it emits. */
export function of<T>(value: T): ValuedObservable<T> {
  return Object.assign(rxOf(value), { value });
}

export function map<T, R>(
  project: (value: T, index: number) => R,
  thisArg: unknown,
  valued: true,
): (source: ValuedObservable<T>) => ValuedObservable<R>;
export function map<T, R>(
  project: (value: T, index: number) => R,
  thisArg?: unknown,
): (source: Observable<T>) => Observable<R>;
/** `rxjs` `map`. Pass `true` to keep the current value on both sides. */
export function map<T, R>(
  project: (value: T, index: number) => R,
  thisArg?: unknown,
  valued?: boolean,
) {
  const operator = rxMap((value: T, index: number) => project.call(thisArg, value, index));
  if (!valued) return operator;
  return (source: ValuedObservable<T>) => withValue(
    operator(source),
    () => project.call(thisArg, source.value, -1),
  );
}

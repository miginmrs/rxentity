/**
 * Eager replacement for `Observable.pipe`.
 * `pipe` only accepts observables, so a {@link ValuedObservable} would lose `.value`.
 * `on(x).thru(f).thru(g).go()` is `g(f(x))`, and each `thru` runs immediately.
 */
export interface On<T> {
  thru<R>(f: (value: T) => R): On<R>;
  go(): T;
}

class Applied<T> implements On<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  thru<R>(f: (value: T) => R): On<R> {
    return new Applied(f(this.value));
  }

  go(): T {
    return this.value;
  }
}

export function on<T>(value: T): On<T> {
  return new Applied(value);
}

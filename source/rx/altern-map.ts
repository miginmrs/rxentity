import { Observable, Subscription, from, type ObservableInput, type OperatorFunction } from 'rxjs';
import { withValue, type ValuedObservable } from './valued.ts';

export interface AlternMapOptions {
  /** Complete the output when the source completes, even if an inner observable is still open. */
  completeWithSource?: boolean;
  /** Complete the output when the current inner observable completes. */
  completeWithInner?: boolean;
}

/**
 * Like `switchMap`, but subscribes to the next inner observable before
 * unsubscribing from the previous one. Overlapping entity subscriptions
 * therefore stay alive across the swap.
 *
 * Pass `true` when `source` is a {@link ValuedObservable} and `project`
 * returns one. The result is a {@link ValuedObservable} too: `.value` is
 * required on the way in and guaranteed on the way out.
 */
export function alternMap<T, R>(
  project: (value: T, index: number) => ValuedObservable<R>,
  options: AlternMapOptions | undefined,
  valued: true,
): (source: ValuedObservable<T>) => ValuedObservable<R>;
export function alternMap<T, R>(
  project: (value: T, index: number) => ObservableInput<R>,
  options?: AlternMapOptions,
): OperatorFunction<T, R>;
export function alternMap<T, R>(
  project: (value: T, index: number) => ObservableInput<R>,
  options: AlternMapOptions = {},
  valued?: boolean,
): OperatorFunction<T, R> | ((source: ValuedObservable<T>) => ValuedObservable<R>) {
  const operator = (source: Observable<T>) => new Observable<R>(subscriber => {
    let index = 0;
    let innerSub: Subscription | null = null;
    let stopped = false;

    const outerSub = source.subscribe({
      next: value => {
        if (subscriber.closed) return;
        let result: ObservableInput<R>;
        const at = index++;
        try {
          result = project(value, at);
        } catch (error) {
          subscriber.error(error);
          return;
        }
        const previous = innerSub;
        const state: { sub: Subscription | null; done: boolean } = { sub: null, done: false };
        state.sub = from(result).subscribe({
          next: inner => subscriber.next(inner),
          error: error => subscriber.error(error),
          complete: () => {
            state.done = true;
            if (innerSub === state.sub) innerSub = null;
            if (stopped || options.completeWithInner) subscriber.complete();
          },
        });
        innerSub = state.done || subscriber.closed ? null : state.sub;
        previous?.unsubscribe();
      },
      error: error => subscriber.error(error),
      complete: () => {
        stopped = true;
        if (!innerSub || innerSub.closed || options.completeWithSource) subscriber.complete();
      },
    });

    return () => {
      stopped = true;
      innerSub?.unsubscribe();
      innerSub = null;
      outerSub.unsubscribe();
    };
  });

  if (!valued) return operator;
  const read = project as (value: T, index: number) => ValuedObservable<R>;
  return (source: ValuedObservable<T>) => withValue(
    operator(source),
    () => read(source.value, -1).value,
  );
}

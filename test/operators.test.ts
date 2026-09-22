import assert from 'node:assert/strict';
import test from 'node:test';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { alternMap } from '../source/rx/altern-map.ts';
import { on } from '../source/rx/on.ts';
import { map, of } from '../source/rx/valued.ts';

test('alternMap subscribes to the next inner observable before dropping the previous one', () => {
  const events: string[] = [];
  const outer = new Subject<string>();
  const inner = (name: string) => new Observable<string>(subscriber => {
    events.push(`subscribe ${name}`);
    subscriber.next(name);
    return () => { events.push(`unsubscribe ${name}`); };
  });

  const received: string[] = [];
  const subscription = outer.pipe(alternMap(name => inner(name))).subscribe(value => {
    received.push(value);
  });

  outer.next('a');
  outer.next('b');
  subscription.unsubscribe();

  assert.deepEqual(received, ['a', 'b']);
  assert.deepEqual(events, [
    'subscribe a',
    'subscribe b',
    'unsubscribe a',
    'unsubscribe b',
  ]);
});

test('on(x).thru(f).thru(g).go() is g(f(x)), applied as each step is added', () => {
  const calls: string[] = [];
  const afterF = on(1).thru(n => {
    calls.push('f');
    return n + 1;
  });
  assert.deepEqual(calls, ['f']);
  const afterG = afterF.thru(n => {
    calls.push('g');
    return n * 10;
  });
  assert.deepEqual(calls, ['f', 'g']);
  assert.equal(afterG.go(), 20);
});

test('valued operators expose the current value without a subscriber', () => {
  const source = Object.assign(new BehaviorSubject(of(1)), {});
  const doubled = map((value: number) => value + 1, undefined, true)(source.value);
  assert.equal(doubled.value, 2);

  const flattened = alternMap((value: ReturnType<typeof of<number>>) => value, {}, true)(source);
  assert.equal(flattened.value, 1);
  source.next(of(4));
  assert.equal(flattened.value, 4);
});

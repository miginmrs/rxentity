import { Promise as Bluebird, resolve } from "bluebird";
import { assert, expect } from "chai";
import { Subject, Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { Store } from "../source/store"

const one = BigInt(1), two = BigInt(2);

Bluebird.setScheduler(fn => fn());
describe('Store', () => {
  type User = { name: string, login: string };
  const store = new Store<bigint, User>('A', (id, entity) => { }, Bluebird);
  const storeItems = store['_items'];
  it('should implemenet prepare correctly', async () => {
    const actions: number[] = [];
    const subs = new Subscription();
    const subject = new Subject<void>();
    const p = store.prepare(one, (id, i, join) => {
      new Bluebird<void>(resolve => setTimeout(() => {
        store.next(id, { name: 'user', login: 'login' })
        const item = storeItems.get(one)!;
        expect({
          closed: item.closed, ready: item.ready, $entity: !!item.entity, $next: !!item.next,
          nObs: item.observers.length, parent: item.parentSubscription
        }).deep.eq({
          closed: undefined, ready: true, $entity: true, $next: true, nObs: 1, parent: undefined
        })
        // tell other handlers to give up
        resolve();
        join(new Subscription(() => actions.push(1)));
        subject.next();
      }, 0))
    });
    expect(storeItems.size).eq(0)
    const step1 = subject.pipe(take(1)).toPromise(Bluebird);
    subs.add(p.subscribe());
    expect(storeItems.size).eq(1)
    const item = storeItems.get(one)!;
    expect(item).keys(['id', 'observers', 'next']);
    expect(item.observers.length).eq(1);
    expect(actions.length).eq(0);
    await step1;
    subs.unsubscribe();
    expect(item.observers.length).eq(0)
    expect(storeItems.size).eq(0)
    expect(actions).deep.eq([1]);
    const step2 = subject.pipe(take(1)).toPromise(Bluebird);
    const subs2 = p.subscribe();
    await step2;
    subs2.unsubscribe();
    expect(item.observers.length).eq(0)
    expect(storeItems.size).eq(0)
    expect(actions).deep.eq([1, 1]);
  });
  it('should implemenet changeId correctly', async () => {
    const stack: User[] = []
    const subscription = store.prepare(one, () => Promise.reject(null)).subscribe(x=>stack.push(x.snapshot));
    const subject = new Subject<void>(), step1 = subject.pipe(take(1)).toPromise();
    const u = store.prepare(one, (id) => {
      expect(id).eq(two);
      const data = { login: 'login', name: 'name' };
      store.next(id, data);
      expect(stack).deep.eq([data]);
      subject.next();
    });
    const subs = u.subscribe();
    expect(storeItems.size).eq(1);
    store.updateId(one, two);
    await step1;
    subscription.unsubscribe();
    subs.unsubscribe();
    expect(storeItems.size).eq(0);
  });
})
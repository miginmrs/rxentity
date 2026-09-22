/**
 * A stored list pages rows into a TopStore.
 *
 * Subscribing to `entities` loads the first page. `retrieve` receives the
 * first and last row already on the list, which is enough to build a cursor.
 * The rows stay in the store until the list subscription ends.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { $snapshot, TopStore, createStoredList } from 'rxentity';

type Task = { id: string; title: string };

const pages: Task[][] = [
  [
    { id: '1', title: 'Write the README' },
    { id: '2', title: 'Add examples' },
  ],
  [
    { id: '3', title: 'Publish the package' },
  ],
];

export async function main() {
  const tasks = new TopStore<string, keyof Task, Task>('tasks', () => undefined, Promise);
  const cursors: Array<string | undefined> = [];

  const list = createStoredList('tasks', tasks, {
    idOf: row => row.id,
    retrieve: async (_first, last) => {
      const after = last ? $snapshot(last).id : undefined;
      cursors.push(after);
      const rows = after ? pages[1] : pages[0];
      return { done: Boolean(after), rows };
    },
  });

  const seen: { titles: string[]; done: boolean | null | undefined }[] = [];
  let ready!: () => void;
  const firstPage = new Promise<void>(resolve => { ready = resolve; });
  const subscription = list.entities.subscribe(page => {
    seen.push({
      titles: page.list.map(row => $snapshot(row.tasks).title),
      done: page.status,
    });
    if (seen.length === 1) ready();
  });

  await firstPage;
  await list.more();
  subscription.unsubscribe();

  let kept = false;
  tasks.get('1').observable.subscribe(() => { kept = true; }).unsubscribe();

  return { cursors, seen, kept };
}

test('a stored list pages rows and releases them with the subscription', async () => {
  const { cursors, seen, kept } = await main();
  assert.deepEqual(cursors, [undefined, '2']);
  assert.deepEqual(seen, [
    { titles: ['Write the README', 'Add examples'], done: false },
    { titles: ['Write the README', 'Add examples', 'Publish the package'], done: true },
  ]);
  assert.equal(kept, false);
});

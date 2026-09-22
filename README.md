# rxentity

RxJS stores of observable records. A record stays in memory while something is subscribed to it, can be viewed through stacked layers that inherit and override fields, and can be filled from a pageable list.

```bash
npm install rxentity rxjs
```

`rxjs` 7 is a peer dependency. The package ships ESM and CommonJS types.

## A store

`TopStore` keeps one record per id, and only while a subscriber holds it. Call `next` after something is listening, or use `prepare` to load when the subscription starts. `update` patches fields that already exist. When the last subscriber leaves, the record is dropped and the finalize function runs.

Field observables replay their current value. `person.name.value` is that value, and subscribing to `person.name` emits later edits.

```ts
import { $snapshot, TopStore } from 'rxentity';

type Person = { id: string; name: string; role: string };

const released: string[] = [];
const people = new TopStore<string, keyof Person, Person>(
  'people',
  id => { released.push(id); },
  Promise,
);

const names: string[] = [];
const subscription = people.get('ada').name.subscribe(name => names.push(name));

people.next('ada', { id: 'ada', name: 'Ada', role: 'Engineer' });
people.update('ada', { name: 'Ada Lovelace' });
// names: ['Ada', 'Ada Lovelace']

// A second subscriber sees the current value while the first is still held.
people.get('ada').name.subscribe(name => console.log(name)); // Ada Lovelace

// Nothing is listening for this id, so the write is discarded.
people.next('ghost', { id: 'ghost', name: 'Ghost', role: 'None' });

// prepare subscribes first, then runs the loader.
const loading = people.prepare('grace', id => {
  people.next(id, { id, name: 'Grace', role: 'Admiral' });
}).subscribe(person => console.log($snapshot(person)));

subscription.unsubscribe();
loading.unsubscribe();
// released: ['ada', 'grace']
```

`examples/01-store.test.ts` is this walkthrough, with assertions. `npm test` runs it.

## Layers

`createChildStore` builds a draft over a `TopStore`. A field follows the parent until `update` writes a local value. `$levelOf` reports how many stores sit between a field and the store that owns the value: `1` while the draft follows the parent, `0` after a local edit. `rewind` drops the local value. The parent is unchanged.

```ts
import { $levelOf, TopStore, createChildStore } from 'rxentity';

type Person = { id: string; name: string; role: string };

const people = new TopStore<string, keyof Person, Person>('people', () => undefined, Promise);
const drafts = createChildStore('drafts', people);

const trace: { name: string; level: number }[] = [];
const draft = drafts.get('ada').observable.subscribe(person => {
  person.name.subscribe(name => {
    trace.push({ name, level: $levelOf(person, 'name').value });
  });
});

people.next('ada', { id: 'ada', name: 'Ada', role: 'Engineer' });
drafts.update('ada', { name: 'A. Lovelace' });
drafts.rewind('ada');
draft.unsubscribe();

// trace:
// { name: 'Ada', level: 1 }
// { name: 'A. Lovelace', level: 0 }
// { name: 'Ada', level: 1 }
```

`ChildStore` is the same idea over any parent store, including another child. See `examples/02-layers.test.ts`.

## Lists

`createStoredList` pages rows into one store. Subscribing to `entities` loads the first page and keeps every loaded row alive until that subscription ends. `retrieve` is called with the first and last row already on the list, so either end can be a cursor. `more` asks for the next page and appends it. `status` is `false` while further pages exist, `true` when the list is complete, and `null` when the last load failed.

```ts
import { $snapshot, TopStore, createStoredList } from 'rxentity';

type Task = { id: string; title: string };

const tasks = new TopStore<string, keyof Task, Task>('tasks', () => undefined, Promise);

const list = createStoredList('tasks', tasks, {
  idOf: row => row.id,
  retrieve: async (_first, last) => {
    const after = last ? $snapshot(last).id : undefined;
    const rows = after
      ? [{ id: '3', title: 'Publish the package' }]
      : [
          { id: '1', title: 'Write the README' },
          { id: '2', title: 'Add examples' },
        ];
    return { done: Boolean(after), rows };
  },
});

async function pages() {
  const subscription = list.entities.subscribe(page => {
    console.log(page.status, page.list.map(row => $snapshot(row.tasks).title));
  });

  // The first page is already loading. Wait for it, then ask for the next one.
  await new Promise<void>(resolve => {
    const once = list.entities.subscribe(() => {
      once.unsubscribe();
      resolve();
    });
  });
  await list.more();
  subscription.unsubscribe();
}

pages();
// false  ['Write the README', 'Add examples']
// true   ['Write the README', 'Add examples', 'Publish the package']
```

A list can also target several stores at once, and a `ChildStoredList` can follow a parent list. Those are `TopStoredList` and `ChildStoredList`. `examples/03-list.test.ts` covers the one-store case.

## API

| Export | What it does |
| --- | --- |
| `TopStore` | Root store. `get(id)` returns a flow; `next`, `update`, `rewind`, and `prepare` write to it. |
| `createChildStore` | Draft layer over a `TopStore`. |
| `ChildStore` | Layer over any parent store. |
| `createStoredList` | Pageable list that fills one `TopStore`. |
| `TopStoredList`, `ChildStoredList` | Lists over a map of stores, including lists that follow a parent list. |
| `$snapshot`, `$local` | Current values of every field, or only the fields written on this layer. |
| `$update`, `$rewind`, `$levelOf` | Patch a record, drop local overrides, or read how deep a field is inherited. |
| `insertions` | Emits the ids created by the latest `next` or `nextBulk`. |

`get(id)` returns an `EntityFlow`. `flow.observable` emits the record. `flow.name` (or whatever the field is called) emits that field. The record object itself is a proxy: `person.name` is the same field observable.

`insertions` is also available as `insersions`, and `emptyInsertions` as `emptyInsersions`. Those are the original spellings.

## Development

```bash
npm test
```

That bundles the package, checks the publish layout, typechecks the examples, and runs them. The repository is TypeScript. The files npm installs are the built JavaScript and the type declarations. Running the tests needs Node 24 or newer, because the tests are TypeScript and the bundler requires it.

## License

[ISC](LICENSE.txt)

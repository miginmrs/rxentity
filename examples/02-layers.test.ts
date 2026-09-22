/**
 * A child store is a writable view over a parent store.
 *
 * Until a field is updated locally, reading it follows the parent.
 * `levelOf` reports how many stores sit between a field and the store
 * that owns the value: 1 while the draft follows the parent, 0 after a
 * local edit. `rewind` drops the local value.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { $levelOf, TopStore, createChildStore } from 'rxentity';

type Person = { id: string; name: string; role: string };

export async function main() {
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

  let baseName = '';
  const base = people.get('ada').name.subscribe(name => { baseName = name; });

  drafts.rewind('ada');
  draft.unsubscribe();
  base.unsubscribe();

  return { trace, baseName };
}

test('a draft layer can override a parent field and rewind it', async () => {
  const { trace, baseName } = await main();
  assert.deepEqual(trace, [
    { name: 'Ada', level: 1 },
    { name: 'A. Lovelace', level: 0 },
    { name: 'Ada', level: 1 },
  ]);
  assert.equal(baseName, 'Ada');
});

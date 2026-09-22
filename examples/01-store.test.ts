/**
 * Records live in a TopStore only while something is subscribed.
 *
 * `next` delivers a record to current subscribers. It does not keep a copy
 * for a subscriber that arrives later. `update` patches fields in place.
 * When the last subscriber leaves, the store drops the record and calls
 * the finalize function you passed to the constructor.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { $snapshot, TopStore } from 'rxentity';

type Person = { id: string; name: string; role: string };

export async function main() {
  const released: string[] = [];
  const people = new TopStore<string, keyof Person, Person>(
    'people',
    id => { released.push(id); },
    Promise,
  );

  const names: string[] = [];
  let fields: string[] = [];
  const subscription = people.get('ada').name.subscribe(name => names.push(name));
  const record = people.get('ada').observable.subscribe(person => {
    fields = Object.keys(person);
  });

  people.next('ada', { id: 'ada', name: 'Ada', role: 'Engineer' });
  people.update('ada', { name: 'Ada Lovelace' });

  let replay = '';
  people.get('ada').name.subscribe(name => { replay = name; }).unsubscribe();

  people.next('ghost', { id: 'ghost', name: 'Ghost', role: 'None' });
  let ghostArrived = false;
  people.get('ghost').observable.subscribe(() => { ghostArrived = true; }).unsubscribe();

  const loaded: Person[] = [];
  const loading = people.prepare('grace', id => {
    people.next(id, { id, name: 'Grace', role: 'Admiral' });
  }).subscribe(person => loaded.push($snapshot(person)));

  subscription.unsubscribe();
  record.unsubscribe();
  loading.unsubscribe();

  return { names, fields, replay, ghostArrived, loaded, released };
}

test('a store keeps records only while they are observed', async () => {
  const result = await main();
  assert.deepEqual(result.names, ['Ada', 'Ada Lovelace']);
  assert.deepEqual(result.fields, ['id', 'name', 'role']);
  assert.equal(result.replay, 'Ada Lovelace');
  assert.equal(result.ghostArrived, false);
  assert.deepEqual(result.loaded, [{ id: 'grace', name: 'Grace', role: 'Admiral' }]);
  assert.deepEqual(result.released, ['ada', 'grace']);
});

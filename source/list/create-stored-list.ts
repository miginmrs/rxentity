import { $snapshot } from '../entity/entity-proxies';
import type { Entity } from '../entity/entity-proxies';
import type { TopStore } from '../store';
import { TopStoredList } from './stored-list';

type Field<Row> = Extract<keyof Row, string>;
type RowEntity<Row, ID> = Entity<Field<Row>, Row, Row, TopStore<ID, Field<Row>, Row>>;

/**
 * A pageable list backed by one {@link TopStore}.
 *
 * Each page is a list of rows. The list keeps those rows in the store for as
 * long as something subscribes to {@link TopStoredList.entities}. `retrieve`
 * is called with the first and last row already on the list, so a cursor can
 * be read from either end. Omit both when loading the first page.
 */
export function createStoredList<Key extends string, ID, Row extends Record<string, any>>(
  key: Key,
  store: TopStore<ID, Field<Row>, Row>,
  options: {
    idOf: (row: Row) => ID;
    retrieve: (
      first?: RowEntity<Row, ID>,
      last?: RowEntity<Row, ID>,
    ) => PromiseLike<{ done?: boolean; rows: Row[] }>;
  },
) {
  type Shape = Record<Key, Row>;
  return new TopStoredList<Key, Record<Key, ID>, Record<Key, Field<Row>>, Key, Shape>({
    key,
    stores: { [key]: store } as { [K in Key]: TopStore<ID, Field<Row>, Row> },
    promiseCtr: Promise,
    keyof: (_name, row) => options.idOf(row),
    keyofEntity: (_name, entity) => options.idOf($snapshot(entity) as Row),
    merge: (_name, current, incoming) => current.concat(incoming),
    retrieve: async (first, last) => {
      const page = await options.retrieve(first?.[key] as RowEntity<Row, ID> | undefined, last?.[key] as RowEntity<Row, ID> | undefined);
      return {
        done: page.done,
        data: page.rows.map(row => ({ [key]: row }) as Shape),
      };
    },
  });
}

import { Rec } from '..';
import { ValuedSubject, of } from 'rxvalue';


/** 
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export abstract class EntityAbstract<K extends string, T extends Rec<K>, V extends T> {
  /** `function` that returns the `ValuedSubject` for the givin `field` */
  abstract readonly rx: EntityFieldsFct<K, T, V>;
  /** `map` that stores the `ValuedSubject` for all the entity `fields` */
  abstract readonly rxMap: Readonly<EntityFieldsMap<K, T, V>>;
  /** a `getter` snapshot for the *local* `fields` */
  abstract readonly local: Partial<Pick<T, K>>;

  /** a `getter` snapshot for all the entity `fields` */
  get snapshot() {
    const snapshot = {} as Pick<T, K>;
    const rx = this.rx;
    for (const k of Object.keys(this.rxMap) as K[]) {
      snapshot[k] = rx(k).value;
    }
    return snapshot;
  }

  /** updates some fields of the entity */
  readonly update = <SK extends K>(e: { [k in SK]: V[k] }) => {
    const rx = this.rx;
    (Object.keys(e) as SK[]).forEach(<k extends SK>(k: k) => {
      rx(k).next(e[k]);
    });
  };

  /** undo local changes in the entity */
  readonly rewind = <SK extends K>(_field?: SK) => { };

  /** define the parent of the entity */
  readonly setParent = () => { };

  /** get the number of entities between the actual and the source of the field */
  readonly levelOf = <SK extends K>(_field: SK) => of(0);
}

/** `function` that associates to each key of an entity a `ValuedSubject` */
export type EntityFieldsFct<K extends string, T extends Rec<K>, V extends T = T> = {
  <k extends K>(k: k): ValuedSubject<T[k], V[k]>;
};

/** `map` that associates to each key of an entity a `ValuedSubject` */
export type EntityFieldsMap<K extends string, T extends Rec<K>, V extends T = T> = {
  [k in K]: ValuedSubject<T[k], V[k]>
};


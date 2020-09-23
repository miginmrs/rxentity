import { Observable } from "rxjs";
import { ValuedSubject, of } from '../valued-observable';
import { KeyOf, Merge } from "../common";


/** 
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export abstract class EntityAbstract<T, V extends T> {
  /** `function` that returns the `ValuedSubject` for the givin `field` */
  abstract readonly rx: EntityFieldsFct<T, V>;
  /** `map` that stores the `ValuedSubject` for all the entity `fields` */
  abstract readonly rxMap: Readonly<EntityFieldsMap<T, V>>;
  /** a `getter` snapshot for the *local* `fields` */
  abstract readonly local: Partial<Merge<T>>;

  /** a `getter` snapshot for all the entity `fields` */
  get snapshot() {
    const snapshot = {} as Merge<T>;
    const rx = this.rx;
    for (const k of Object.keys(this.rxMap) as KeyOf<T>[]) {
      snapshot[k] = rx(k).value;
    }
    return snapshot;
  }

  /** updates some fields of the entity */
  readonly update = <K extends KeyOf<T>>(e: { [k in K]: V[k] }) => {
    const rx = this.rx;
    (Object.keys(e) as K[]).forEach(<k extends K>(k: k) => {
      rx(k).next(e[k]);
    });
  };

  /** undo local changes in the entity */
  readonly rewind = <K extends keyof T>(_field?: K) => { };

  /** define the parent of the entity */
  readonly setParent = () => { };

  /** get the number of entities between the actual and the source of the field */
  readonly levelOf = <K extends KeyOf<T>>(_field: K) => of(0);
}

/** `function` that associates to each key of an entity a `ValuedSubject` */
export type EntityFieldsFct<T, V extends T = T> = {
  <k extends KeyOf<T>>(k: k): ValuedSubject<T[k], V[k]>;
};

/** `map` that associates to each key of an entity a `ValuedSubject` */
export type EntityFieldsMap<T, V extends T = T> = {
  [k in KeyOf<T>]: ValuedSubject<T[k], V[k]>
};


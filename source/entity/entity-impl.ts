import { BehaviorSubject } from "rxjs";
import { Rec } from "..";
import { EntityAbstract, EntityFieldsFct, EntityFieldsMap } from "./entity-abstract";

/** 
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export class EntityImpl<K extends string, T extends Rec<K>, V extends T, S> extends EntityAbstract<K, T, V, S> {
  readonly rx: EntityFieldsFct<K, T, V> = <k extends K>(k: k) => {
    return this.rxMap[k] || (this.rxMap[k] = new BehaviorSubject<V[k]>(undefined as any));
  };
  readonly rxMap: EntityFieldsMap<K, T, V>;
  get local() { return this.snapshot; }
  readonly store: S;
  constructor(e: V, store: S) {
    super();
    this.store = store;
    const rxMap = this.rxMap = {} as EntityFieldsMap<K, V>;
    (Object.keys(e) as K[]).forEach(k => {
      rxMap[k] = new BehaviorSubject(e[k])
    })
  }
};

import { BehaviorSubject } from "rxjs";
import { KeyOf } from "../common";
import { EntityAbstract, EntityFieldsFct, EntityFieldsMap } from "./entity-abstract";

/** 
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export class EntityImpl<T, V extends T> extends EntityAbstract<T, V> {
  readonly rx: EntityFieldsFct<T, V> = <k extends KeyOf<T>>(k: k) => {
    return this.rxMap[k] || (this.rxMap[k] = new BehaviorSubject<V[k]>(undefined as any));
  };
  readonly rxMap: EntityFieldsMap<T, V>;
  get local() { return this.snapshot; }
  constructor(e: V) {
    super();
    const rxMap = this.rxMap = {} as EntityFieldsMap<V>;
    (Object.keys(e) as KeyOf<V>[]).forEach(k => {
      rxMap[k as keyof V as KeyOf<V>] = new BehaviorSubject(e[k as keyof V as KeyOf<V>])
    })
  }
};

import { BehaviorSubject, identity, of } from "rxjs";
import { alternMap } from "altern-map";
import { map } from "rxjs/operators";
import { EntityFieldsFct, EntityFieldsMap, EntityAbstract } from "./entity-abstract";
import { ValuedSubject, current } from "../valued-observable";
import { Entity } from "./entity-proxies";
import { guard, KeyOf, Merge, toKeyOf } from "../common";

/** 
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template K union of initial field keys
 */
export class ChildEntityImpl<T, P extends T, V extends T, K extends KeyOf<T>> extends EntityAbstract<T, V> {
  readonly rx: EntityFieldsFct<T, V> = <k extends KeyOf<T>>(k: k) => {
    return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
  };
  private createRx<k extends KeyOf<T>>(k: k): ValuedSubject<T[k], V[k]> {
    const rxSource: ValuedSubject<ValuedSubject<T[k], V[k]>> = this.rxSource(k);
    return Object.assign(rxSource.pipe(alternMap(identity)), {
      next: (x: V[k]) => this._parent && current(rxSource) === this._parent.rx(k)
        ? rxSource.next(new BehaviorSubject<T[k]>(x))
        : current(rxSource).next(x)
    });
  }
  readonly rxMap: EntityFieldsMap<T, V>;
  private rxSource = <k extends KeyOf<T>>(k: k) => {
    return this.rxSourceMap[k] || (
      this.rxSourceMap[k] = new BehaviorSubject<ValuedSubject<T[k], V[k]>>(this._parent
        ? this._parent.rx(k)
        : new BehaviorSubject<V[k]>(undefined as any)
      )
    );
  };
  private rxSourceMap: { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
  private _parent: Entity<P, any> | undefined = undefined;
  get parent() { return this._parent; };

  get local() {
    if (!this._parent) return this.snapshot;
    const parent = this._parent;
    const snapshot: Partial<Merge<T>> = {};
    const rxSourceMap = this.rxSourceMap;
    for (const k of Object.keys(rxSourceMap) as KeyOf<T>[]) {
      const source = rxSourceMap[k].value;
      if (source !== parent.rxMap[k]) snapshot[k] = current(source);
    }
    return snapshot;
  }

  constructor(params: {
    data: V;
    parentPromise: { then: (setParent: (parent: Entity<P, any>) => void) => void; };
    parent?: undefined;
  } | {
    data: { [k in K]: V[k] }; 
    parent: Entity<P, any>;
  }) {
    super();
    const rxMap = this.rxMap = {} as EntityFieldsMap<T, V>;
    const rxSourceMap = this.rxSourceMap = {} as { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
    let keys: KeyOf<T>[];
    if (params.parent === undefined) {
      const { data, parentPromise } = params;
      keys = Object.keys(data) as KeyOf<T>[];
      parentPromise.then(this.setParent);
      keys.forEach(<k extends keyof T>(k: k) => {
        rxSourceMap[k] = new BehaviorSubject<ValuedSubject<T[k], V[k]>>(new BehaviorSubject(data[k] as T[k]));
      });
    } else {
      const { data, parent } = params;
      this._parent = parent;
      keys = Object.keys(parent.rxMap) as KeyOf<T>[];
      keys.forEach(<k extends KeyOf<T>>(k: k) => {
        const next: ValuedSubject<T[k], V[k]> = guard<keyof T, K>(k, k in data)
          ? new BehaviorSubject(data[k] as V[k])
          : parent.rx(k);
        rxSourceMap[k] = new BehaviorSubject(next);
      });
    }
    keys.forEach(<k extends KeyOf<T>>(k: k) => rxMap[k] = this.createRx(k));
  }

  setParent = (parent?: Entity<P, any>) => {
    const oldParent = this.parent;
    this._parent = parent;
    const rxSourceMap = this.rxSourceMap;
    if (parent) (Object.keys(rxSourceMap) as KeyOf<T>[]).forEach(<k extends KeyOf<T>>(k: k) => {
      if (rxSourceMap[k].value === undefined) {
        rxSourceMap[k].next(parent.rx(k));
      }
    });
    if (!oldParent) return;
    (Object.keys(oldParent.rxMap) as KeyOf<T>[]).forEach(<k extends KeyOf<T>>(k: k) => {
      if (rxSourceMap[k]?.value === oldParent.rxMap[k]) {
        if (parent) rxSourceMap[k].next(parent.rx(k));
        else {
          rxSourceMap[k].next(new BehaviorSubject<T[k]>(current(oldParent.rxMap[k])));
        }
      }
    });
  };

  readonly rewind = <K extends keyof T>(field?: K) => {
    const parent = this._parent;
    if (!parent) return;
    (field ? [toKeyOf<T>(field)] : Object.keys(this.rxSourceMap) as KeyOf<T>[]).forEach(
      field => this.rxSource(field).next(parent.rx(field))
    );
  };

  readonly levelOf = <K extends KeyOf<T>>(field: K) => this.rxSource(field).pipe(alternMap(
    src => src === this._parent?.rxMap[field] ? this._parent.levelOf(field).pipe(map(l => l + 1)) : of(0)
  ));
}

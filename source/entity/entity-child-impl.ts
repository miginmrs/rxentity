import { BehaviorSubject, identity } from "rxjs";
import { EntityFieldsFct, EntityFieldsMap, EntityAbstract } from "./entity-abstract";
import { altern, ValuedSubject, map, of } from "../valued-observable";
import { Entity, $rx, $rxMap, $levelOf } from "./entity-proxies";
import { guard, Rec } from "../common";

/** 
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
export class ChildEntityImpl<K extends string, T extends Rec<K>, P extends T, V extends T, I extends K, PE extends Entity<K, P, any> = Entity<K, P, any>> extends EntityAbstract<K, T, V> {
  readonly rx: EntityFieldsFct<K, T, V> = <k extends K>(k: k) => {
    return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
  };
  private createRx<k extends K>(k: k): ValuedSubject<T[k], V[k]> {
    const rxSource: ValuedSubject<ValuedSubject<T[k], V[k]>> = this.rxSource(k);
    return Object.assign(altern(rxSource, identity), {
      next: (x: V[k]) => this._parent && rxSource.value === $rx(this._parent, k)
        ? rxSource.next(new BehaviorSubject<T[k]>(x))
        : rxSource.value.next(x)
    });
  }
  readonly rxMap: EntityFieldsMap<K, T, V>;
  private rxSource = <k extends K>(k: k) => {
    return this.rxSourceMap[k] || (
      this.rxSourceMap[k] = new BehaviorSubject<ValuedSubject<T[k], V[k]>>(this._parent
        ? $rx(this._parent, k)
        : new BehaviorSubject<V[k]>(undefined as any)
      )
    );
  };
  private rxSourceMap: { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
  private _parent: PE | undefined = undefined;
  get parent() { return this._parent; };

  get local() {
    if (!this._parent) return this.snapshot;
    const parent = this._parent;
    const snapshot: Partial<Pick<T, K>> = {};
    const rxSourceMap = this.rxSourceMap;
    for (const k of Object.keys(rxSourceMap) as K[]) {
      const source = rxSourceMap[k].value;
      if (source !== $rxMap(parent)[k]) snapshot[k] = source.value;
    }
    return snapshot;
  }

  constructor(params: {
    data: V;
    parentPromise: { then: (setParent: (parent: PE) => void) => void; };
    ready: false;
  } | {
    data: { [k in I]: V[k] };
    parent: PE;
    ready: true;
  }) {
    super();
    const rxMap = this.rxMap = {} as EntityFieldsMap<K, T, V>;
    const rxSourceMap = this.rxSourceMap = {} as { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
    let keys: K[];
    if (params.ready) {
      const { data, parent } = params;
      this._parent = parent;
      keys = Object.keys($rxMap(parent)) as K[];
      keys.forEach(<k extends K>(k: k) => {
        const next: ValuedSubject<T[k], V[k]> = guard<keyof T, I>(k, k in data)
          ? new BehaviorSubject(data[k] as V[k])
          : $rx(parent, k);
        rxSourceMap[k] = new BehaviorSubject(next);
      });
    } else {
      const { data, parentPromise } = params;
      keys = Object.keys(data) as K[];
      parentPromise.then(this.setParent);
      keys.forEach(<k extends keyof T>(k: k) => {
        rxSourceMap[k] = new BehaviorSubject<ValuedSubject<T[k], V[k]>>(new BehaviorSubject(data[k] as T[k]));
      });
    }
    keys.forEach(<k extends K>(k: k) => rxMap[k] = this.createRx(k));
  }

  setParent = (parent?: PE) => {
    const oldParent = this.parent;
    this._parent = parent;
    const rxSourceMap = this.rxSourceMap;
    if (parent) (Object.keys(rxSourceMap) as K[]).forEach(<k extends K>(k: k) => {
      if (rxSourceMap[k].value === undefined) {
        rxSourceMap[k].next($rx(parent, k));
      }
    });
    if (!oldParent) return;
    (Object.keys($rxMap(oldParent)) as K[]).forEach(<k extends K>(k: k) => {
      if (rxSourceMap[k]?.value === $rxMap(oldParent)[k]) {
        if (parent) rxSourceMap[k].next($rx(parent, k));
        else {
          rxSourceMap[k].next(new BehaviorSubject<T[k]>($rxMap(oldParent)[k].value));
        }
      }
    });
  };

  readonly rewind = <SK extends K>(field?: SK) => {
    const parent = this._parent;
    if (!parent) return;
    (field ? [field] : Object.keys(this.rxSourceMap) as SK[]).forEach(
      field => this.rxSource(field).next($rx(parent, field))
    );
  };

  readonly levelOf = <SK extends K>(field: SK) => altern(this.rxSource(field),
    (src: unknown) => src === this._parent?.[field] ? map($levelOf(this._parent!, field), l => l + 1) : of(0)
  );
}

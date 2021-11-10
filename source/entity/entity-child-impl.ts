import { BehaviorSubject, identity, isObservable, Observable, Subscription } from "rxjs";
import { EntityFieldsFct, EntityFieldsMap, EntityAbstract, LinkedValuedSubject } from "./entity-abstract";
import { ValuedSubject, map, of, ValuedObservable } from "rxvalue";
import { Entity, $rx, $rxMap, $levelOf } from "./entity-proxies";
import { guard, Rec } from "../common";
import { alternMap } from "altern-map";

/** 
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
export class ChildEntityImpl<K extends string, T extends Rec<K>, V extends T, P extends T, S, pimpl extends EntityAbstract<K, P, any, any> = EntityAbstract<K, P, any, S>> extends EntityAbstract<K, T, V, S> {
  readonly rx: EntityFieldsFct<K, T, V> = <k extends K>(k: k) => {
    return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
  };
  private createRx<k extends K>(k: k): LinkedValuedSubject<T[k], V[k]> {
    const rxSource: ValuedSubject<ValuedSubject<T[k], V[k]>> = this.rxSource(k);
    const clone = alternMap<ValuedObservable<T[k]>, T[k]>(identity, {}, true);
    const v = rxSource.value;
    let subs = this._parent && v === $rx(this._parent, k) || !isObservable(v?.value) ? undefined : v.value.subscribe(() => { });
    const unlink = () => subs?.unsubscribe();
    const next = (x: V[k]) => {
      let old = subs;
      if (isObservable(x)) subs = x.subscribe(() => { })
      old?.unsubscribe()
      if (this._parent && rxSource.value === $rx(this._parent, k)) {
        rxSource.next(new BehaviorSubject<T[k]>(x))
      } else {
        rxSource.value.next(x)
      }
    }
    return Object.assign(rxSource.pipe(clone), { next, unlink });
  }
  readonly rxMap: EntityFieldsMap<K, T, V>;
  private rxSource = <k extends K>(k: k) => {
    return this.rxSourceMap[k] || (
      this.rxSourceMap[k] = new BehaviorSubject<ValuedSubject<T[k], V[k]>>(this._parent
        ? $rx(this._parent, k)
        : new BehaviorSubject<V[k]>(undefined!)
      )
    );
  };
  private rxSourceMap: { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
  private _parent: Entity<K, P, any, any, pimpl> | undefined = undefined;
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
    parentPromise: { then: (setParent: (parent: Entity<K, P, any, any, pimpl>) => void) => void; };
    ready: false;
    store: S;
  } | {
    data: { [k in K]?: V[k] };
    parent: Entity<K, P, any, any, pimpl>;
    ready: true;
    store: S;
  }) {
    super(params.store);
    const rxMap = this.rxMap = {} as EntityFieldsMap<K, T, V>;
    const rxSourceMap = this.rxSourceMap = {} as { [k in keyof T]: BehaviorSubject<ValuedSubject<T[k], V[k]>> };
    let keys: K[];
    if (params.ready) {
      const { data, parent } = params;
      this._parent = parent;
      keys = Object.keys($rxMap(parent)) as K[];
      keys.forEach(<k extends K>(k: k) => {
        const next: ValuedSubject<T[k], V[k]> = k in data
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

  setParent = (parent?: Entity<K, P, any, any, pimpl>) => {
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
    (field ? [field] : Object.keys(this.rxSourceMap) as SK[]).forEach(field => {
      this.rx(field).unlink();
      this.rxSource(field).next($rx(parent, field));
    });
  };

  readonly levelOf = <SK extends K>(field: SK): ValuedObservable<number> => this.rxSource(field).pipe(alternMap(
    (src: unknown) => src === this._parent?.[field] ? $levelOf(this._parent!, field).pipe(map(l => l + 1, 0, true)) : of(0),
    {}, true
  ));
}

import { BehaviorSubject, identity } from "rxjs";
import { EntityAbstract } from "./entity-abstract";
import { altern, map, of } from "../valued-observable";
import { $rx, $rxMap, $levelOf } from "./entity-proxies";
import { guard } from "../common";
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
export class ChildEntityImpl extends EntityAbstract {
    constructor(params) {
        super();
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
        };
        this.rxSource = (k) => {
            return this.rxSourceMap[k] || (this.rxSourceMap[k] = new BehaviorSubject(this._parent
                ? $rx(this._parent, k)
                : new BehaviorSubject(undefined)));
        };
        this._parent = undefined;
        this.setParent = (parent) => {
            const oldParent = this.parent;
            this._parent = parent;
            const rxSourceMap = this.rxSourceMap;
            if (parent)
                Object.keys(rxSourceMap).forEach((k) => {
                    if (rxSourceMap[k].value === undefined) {
                        rxSourceMap[k].next($rx(parent, k));
                    }
                });
            if (!oldParent)
                return;
            Object.keys($rxMap(oldParent)).forEach((k) => {
                if (rxSourceMap[k]?.value === $rxMap(oldParent)[k]) {
                    if (parent)
                        rxSourceMap[k].next($rx(parent, k));
                    else {
                        rxSourceMap[k].next(new BehaviorSubject($rxMap(oldParent)[k].value));
                    }
                }
            });
        };
        this.rewind = (field) => {
            const parent = this._parent;
            if (!parent)
                return;
            (field ? [field] : Object.keys(this.rxSourceMap)).forEach(field => this.rxSource(field).next($rx(parent, field)));
        };
        this.levelOf = (field) => altern(this.rxSource(field), (src) => src === this._parent?.[field] ? map($levelOf(this._parent, field), l => l + 1) : of(0));
        const rxMap = this.rxMap = {};
        const rxSourceMap = this.rxSourceMap = {};
        let keys;
        if (params.ready) {
            const { data, parent } = params;
            this._parent = parent;
            keys = Object.keys($rxMap(parent));
            keys.forEach((k) => {
                const next = guard(k, k in data)
                    ? new BehaviorSubject(data[k])
                    : $rx(parent, k);
                rxSourceMap[k] = new BehaviorSubject(next);
            });
        }
        else {
            const { data, parentPromise } = params;
            keys = Object.keys(data);
            parentPromise.then(this.setParent);
            keys.forEach((k) => {
                rxSourceMap[k] = new BehaviorSubject(new BehaviorSubject(data[k]));
            });
        }
        keys.forEach((k) => rxMap[k] = this.createRx(k));
    }
    createRx(k) {
        const rxSource = this.rxSource(k);
        return Object.assign(altern(rxSource, identity), {
            next: (x) => this._parent && rxSource.value === $rx(this._parent, k)
                ? rxSource.next(new BehaviorSubject(x))
                : rxSource.value.next(x)
        });
    }
    get parent() { return this._parent; }
    ;
    get local() {
        if (!this._parent)
            return this.snapshot;
        const parent = this._parent;
        const snapshot = {};
        const rxSourceMap = this.rxSourceMap;
        for (const k of Object.keys(rxSourceMap)) {
            const source = rxSourceMap[k].value;
            if (source !== $rxMap(parent)[k])
                snapshot[k] = source.value;
        }
        return snapshot;
    }
}
//# sourceMappingURL=entity-child-impl.js.map
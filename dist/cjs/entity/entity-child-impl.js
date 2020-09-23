"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChildEntityImpl = void 0;
const rxjs_1 = require("rxjs");
const entity_abstract_1 = require("./entity-abstract");
const valued_observable_1 = require("../valued-observable");
const entity_proxies_1 = require("./entity-proxies");
const common_1 = require("../common");
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
class ChildEntityImpl extends entity_abstract_1.EntityAbstract {
    constructor(params) {
        super();
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = this.createRx(k));
        };
        this.rxSource = (k) => {
            return this.rxSourceMap[k] || (this.rxSourceMap[k] = new rxjs_1.BehaviorSubject(this._parent
                ? entity_proxies_1.$rx(this._parent, k)
                : new rxjs_1.BehaviorSubject(undefined)));
        };
        this._parent = undefined;
        this.setParent = (parent) => {
            const oldParent = this.parent;
            this._parent = parent;
            const rxSourceMap = this.rxSourceMap;
            if (parent)
                Object.keys(rxSourceMap).forEach((k) => {
                    if (rxSourceMap[k].value === undefined) {
                        rxSourceMap[k].next(entity_proxies_1.$rx(parent, k));
                    }
                });
            if (!oldParent)
                return;
            Object.keys(entity_proxies_1.$rxMap(oldParent)).forEach((k) => {
                if (rxSourceMap[k]?.value === entity_proxies_1.$rxMap(oldParent)[k]) {
                    if (parent)
                        rxSourceMap[k].next(entity_proxies_1.$rx(parent, k));
                    else {
                        rxSourceMap[k].next(new rxjs_1.BehaviorSubject(entity_proxies_1.$rxMap(oldParent)[k].value));
                    }
                }
            });
        };
        this.rewind = (field) => {
            const parent = this._parent;
            if (!parent)
                return;
            (field ? [field] : Object.keys(this.rxSourceMap)).forEach(field => this.rxSource(field).next(entity_proxies_1.$rx(parent, field)));
        };
        this.levelOf = (field) => valued_observable_1.altern(this.rxSource(field), (src) => src === this._parent?.[field] ? valued_observable_1.map(entity_proxies_1.$levelOf(this._parent, field), l => l + 1) : valued_observable_1.of(0));
        const rxMap = this.rxMap = {};
        const rxSourceMap = this.rxSourceMap = {};
        let keys;
        if (params.ready) {
            const { data, parent } = params;
            this._parent = parent;
            keys = Object.keys(entity_proxies_1.$rxMap(parent));
            keys.forEach((k) => {
                const next = common_1.guard(k, k in data)
                    ? new rxjs_1.BehaviorSubject(data[k])
                    : entity_proxies_1.$rx(parent, k);
                rxSourceMap[k] = new rxjs_1.BehaviorSubject(next);
            });
        }
        else {
            const { data, parentPromise } = params;
            keys = Object.keys(data);
            parentPromise.then(this.setParent);
            keys.forEach((k) => {
                rxSourceMap[k] = new rxjs_1.BehaviorSubject(new rxjs_1.BehaviorSubject(data[k]));
            });
        }
        keys.forEach((k) => rxMap[k] = this.createRx(k));
    }
    createRx(k) {
        const rxSource = this.rxSource(k);
        return Object.assign(valued_observable_1.altern(rxSource, rxjs_1.identity), {
            next: (x) => this._parent && rxSource.value === entity_proxies_1.$rx(this._parent, k)
                ? rxSource.next(new rxjs_1.BehaviorSubject(x))
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
            if (source !== entity_proxies_1.$rxMap(parent)[k])
                snapshot[k] = source.value;
        }
        return snapshot;
    }
}
exports.ChildEntityImpl = ChildEntityImpl;
//# sourceMappingURL=entity-child-impl.js.map
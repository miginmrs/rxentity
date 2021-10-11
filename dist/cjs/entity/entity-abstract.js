"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkedBehaviorSubject = exports.EntityAbstract = void 0;
const rxvalue_1 = require("rxvalue");
const rxjs_1 = require("rxjs");
/**
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 * @template S store type
 */
class EntityAbstract {
    /** `function` that returns the `ValuedSubject` for the givin `field` */
    constructor(store) {
        this.store = store;
        this.unlinkAll = () => {
            Object.keys(this.rxMap).forEach(k => this.rxMap[k].unlink());
        };
        /** updates some fields of the entity */
        this.update = (e) => {
            const rx = this.rx;
            Object.keys(e).forEach((k) => {
                rx(k).next(e[k]);
            });
        };
        /** undo local changes in the entity */
        this.rewind = (_field) => { };
        /** define the parent of the entity */
        this.setParent = () => { };
        /** get the number of entities between the actual and the source of the field */
        this.levelOf = (_field) => rxvalue_1.of(0);
    }
    /** a `getter` snapshot for all the entity `fields` */
    get snapshot() {
        const snapshot = {};
        const rx = this.rx;
        for (const k of Object.keys(this.rxMap)) {
            snapshot[k] = rx(k).value;
        }
        return snapshot;
    }
}
exports.EntityAbstract = EntityAbstract;
class LinkedBehaviorSubject extends rxjs_1.BehaviorSubject {
    link(value) {
        this.unlink();
        this._subs = value.subscribe(v => super.next(v));
    }
    unlink() {
        this._subs?.unsubscribe();
    }
    next(v) {
        this.unlink();
        super.next(v);
    }
}
exports.LinkedBehaviorSubject = LinkedBehaviorSubject;
//# sourceMappingURL=entity-abstract.js.map
import { of } from 'rxvalue';
import { BehaviorSubject } from 'rxjs';
/**
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 * @template S store type
 */
export class EntityAbstract {
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
        this.levelOf = (_field) => of(0);
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
export class LinkedBehaviorSubject extends BehaviorSubject {
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
//# sourceMappingURL=entity-abstract.js.map
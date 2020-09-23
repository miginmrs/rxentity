"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityAbstract = void 0;
const valued_observable_1 = require("../valued-observable");
/**
 * Entity base class
 * @template T map of fields output types
 * @template V map of fields input types
 */
class EntityAbstract {
    constructor() {
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
        this.levelOf = (_field) => valued_observable_1.of(0);
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
//# sourceMappingURL=entity-abstract.js.map
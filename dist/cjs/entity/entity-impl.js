"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityImpl = void 0;
const entity_abstract_1 = require("./entity-abstract");
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
class EntityImpl extends entity_abstract_1.EntityAbstract {
    constructor(e, store) {
        super(store);
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = new entity_abstract_1.LinkedBehaviorSubject(undefined));
        };
        const rxMap = this.rxMap = {};
        Object.keys(e).forEach(k => {
            rxMap[k] = new entity_abstract_1.LinkedBehaviorSubject(e[k]);
        });
    }
    get local() { return this.snapshot; }
}
exports.EntityImpl = EntityImpl;
;
//# sourceMappingURL=entity-impl.js.map
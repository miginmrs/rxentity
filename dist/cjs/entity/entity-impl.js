"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityImpl = void 0;
const rxjs_1 = require("rxjs");
const entity_abstract_1 = require("./entity-abstract");
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
class EntityImpl extends entity_abstract_1.EntityAbstract {
    constructor(e) {
        super();
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = new rxjs_1.BehaviorSubject(undefined));
        };
        const rxMap = this.rxMap = {};
        Object.keys(e).forEach(k => {
            rxMap[k] = new rxjs_1.BehaviorSubject(e[k]);
        });
    }
    get local() { return this.snapshot; }
}
exports.EntityImpl = EntityImpl;
;
//# sourceMappingURL=entity-impl.js.map
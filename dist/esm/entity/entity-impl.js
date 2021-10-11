import { LinkedBehaviorSubject, EntityAbstract } from "./entity-abstract";
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export class EntityImpl extends EntityAbstract {
    constructor(e, store) {
        super(store);
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = new LinkedBehaviorSubject(undefined));
        };
        const rxMap = this.rxMap = {};
        Object.keys(e).forEach(k => {
            rxMap[k] = new LinkedBehaviorSubject(e[k]);
        });
    }
    get local() { return this.snapshot; }
}
;
//# sourceMappingURL=entity-impl.js.map
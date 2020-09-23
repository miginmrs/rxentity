import { BehaviorSubject } from "rxjs";
import { EntityAbstract } from "./entity-abstract";
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export class EntityImpl extends EntityAbstract {
    constructor(e) {
        super();
        this.rx = (k) => {
            return this.rxMap[k] || (this.rxMap[k] = new BehaviorSubject(undefined));
        };
        const rxMap = this.rxMap = {};
        Object.keys(e).forEach(k => {
            rxMap[k] = new BehaviorSubject(e[k]);
        });
    }
    get local() { return this.snapshot; }
}
;
//# sourceMappingURL=entity-impl.js.map
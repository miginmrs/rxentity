import { alternMap } from "altern-map";
import { guard } from "../common";
/** Extracts the field observable from the entity flow */
const fieldRX = (entity, field) => {
    return entity.pipe(alternMap(e => e.rx(field)));
};
/**
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
export const entityFlow = (observable, field) => new Proxy({}, {
    get(_target, key) {
        if (key === 'observable')
            return observable;
        if (key === 'field')
            return field || (field = new Proxy({}, {
                get(_, k) { return fieldRX(observable, k); }
            }));
        return fieldRX(observable, key);
    }
});
/**
 * Creates a proxified `Entity` from an `EntityAbstract`
 * @see {Entity}
 */
export const toEntity = (entity) => new Proxy(entity, {
    get(target, key) {
        const k = key;
        return guard(key, k in entity) ? target[key] : target.rx(key);
    }
});
//# sourceMappingURL=entity-proxies.js.map
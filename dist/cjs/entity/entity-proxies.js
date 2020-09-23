"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$local = exports.$snapshot = exports.$update = exports.$rewind = exports.$levelOf = exports.$rxMap = exports.$rx = exports.toEntity = exports.entityFlow = exports.getEntity = void 0;
const altern_map_1 = require("altern-map");
const entities = new WeakMap();
function getEntity(e) {
    if (!e)
        return;
    return entities.get(e);
}
exports.getEntity = getEntity;
/** Extracts the field observable from the entity flow */
const fieldRX = (entity, field) => {
    return entity.pipe(altern_map_1.alternMap(e => getEntity(e).rx(field)));
};
/**
 * Creates an `EntityFlow` from an observable
 * @param observable the observable being proxified
 * @param {Record<Observable>} [field] optional external impl of the field observables proxy
 * @see {EntityFlow}
 */
exports.entityFlow = (observable, field) => new Proxy({}, {
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
exports.toEntity = (entity) => {
    const proxy = new Proxy(Object.prototype, {
        get(_, key) {
            return entity.rx(key);
        },
        ownKeys() {
            return Object.keys(entity.rxMap);
        }
    });
    entities.set(proxy, entity);
    return proxy;
};
exports.$rx = (entity, k) => getEntity(entity).rx(k);
exports.$rxMap = (entity) => getEntity(entity).rxMap;
exports.$levelOf = (entity, k) => getEntity(entity).levelOf(k);
exports.$rewind = (entity, k) => getEntity(entity).rewind(k);
exports.$update = (entity, e) => getEntity(entity).update(e);
exports.$snapshot = (entity) => getEntity(entity).snapshot;
exports.$local = (entity) => getEntity(entity).local;
//# sourceMappingURL=entity-proxies.js.map
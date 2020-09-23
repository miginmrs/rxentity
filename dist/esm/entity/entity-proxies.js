import { alternMap } from "altern-map";
const entities = new WeakMap();
export function getEntity(e) {
    if (!e)
        return;
    return entities.get(e);
}
/** Extracts the field observable from the entity flow */
const fieldRX = (entity, field) => {
    return entity.pipe(alternMap(e => getEntity(e).rx(field)));
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
export const toEntity = (entity) => {
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
export const $rx = (entity, k) => getEntity(entity).rx(k);
export const $rxMap = (entity) => getEntity(entity).rxMap;
export const $levelOf = (entity, k) => getEntity(entity).levelOf(k);
export const $rewind = (entity, k) => getEntity(entity).rewind(k);
export const $update = (entity, e) => getEntity(entity).update(e);
export const $snapshot = (entity) => getEntity(entity).snapshot;
export const $local = (entity) => getEntity(entity).local;
//# sourceMappingURL=entity-proxies.js.map
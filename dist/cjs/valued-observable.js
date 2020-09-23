"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromPromise = exports.pipe = exports.combine = exports.altern = exports.distinct = exports.map = exports.of = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const altern_map_1 = require("altern-map");
exports.of = (value) => Object.assign(rxjs_1.of(value), { value });
exports.map = (o, p) => Object.defineProperty(o.pipe(operators_1.map(p)), 'value', { get: () => p(o.value) });
exports.distinct = (o, eq) => Object.defineProperty(o.pipe(operators_1.distinctUntilChanged(eq)), 'value', { get: () => o.value });
exports.altern = (o, p) => Object.defineProperty(o.pipe(altern_map_1.alternMap(p)), 'value', { get: () => p(o.value).value });
exports.combine = (sources) => Object.defineProperty(rxjs_1.combineLatest(sources), 'value', { get: () => sources.map(s => s.value) });
exports.pipe = (o, op) => Object.defineProperty(o.pipe(op), 'value', { get: () => o.value });
exports.fromPromise = (p, value) => {
    const observable = new rxjs_1.Observable(subs => {
        let done = false;
        subs.next(value);
        p.then(v => {
            if (!done)
                subs.next(value = v);
            subs.complete();
        }, err => subs.error(err));
        return () => { done = true; };
    });
    return observable;
};
//# sourceMappingURL=valued-observable.js.map
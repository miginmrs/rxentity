"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Keys = exports.guard = exports.asAsync = exports.wait = exports.runit = void 0;
exports.runit = (gen, promiseCtr) => {
    const runThen = (...args) => {
        const v = args.length ? gen.next(args[0]) : gen.next();
        if (v.done)
            return promiseCtr.resolve(v.value);
        return promiseCtr.resolve(v.value).then(runThen);
    };
    return runThen();
};
function* wait(x) {
    return yield x;
}
exports.wait = wait;
function asAsync(f, promiseCtr, thisArg) {
    return (...args) => exports.runit(f.call(thisArg, ...args), promiseCtr);
}
exports.asAsync = asAsync;
exports.guard = (x, cond) => cond;
class Keys {
    constructor(o) { this.keys = Object.keys(o) /*.sort()*/; }
    mapTo(mapper) {
        const object = {};
        this.keys.forEach((k, i) => object[k] = mapper(k, i));
        return object;
    }
    asyncMapTo(mapper, promiseCtr) {
        const object = {};
        return promiseCtr.all(this.keys.map(k => mapper(k).then(v => object[k] = v))).then(() => object);
    }
}
exports.Keys = Keys;
//# sourceMappingURL=common.js.map
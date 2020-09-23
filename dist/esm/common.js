export const runit = (gen, promiseCtr) => {
    const runThen = (...args) => {
        const v = args.length ? gen.next(args[0]) : gen.next();
        if (v.done)
            return promiseCtr.resolve(v.value);
        return promiseCtr.resolve(v.value).then(runThen);
    };
    return runThen();
};
export function* wait(x) {
    return yield x;
}
export function asAsync(f, promiseCtr, thisArg) {
    return (...args) => runit(f.call(thisArg, ...args), promiseCtr);
}
export const guard = (x, cond) => cond;
export class Keys {
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
//# sourceMappingURL=common.js.map
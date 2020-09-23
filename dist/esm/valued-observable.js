import { combineLatest, of as rxof, Observable } from 'rxjs';
import { distinctUntilChanged, map as rxmap } from 'rxjs/operators';
import { alternMap } from 'altern-map';
export const of = (value) => Object.assign(rxof(value), { value });
export const map = (o, p) => Object.defineProperty(o.pipe(rxmap(p)), 'value', { get: () => p(o.value) });
export const distinct = (o, eq) => Object.defineProperty(o.pipe(distinctUntilChanged(eq)), 'value', { get: () => o.value });
export const altern = (o, p) => Object.defineProperty(o.pipe(alternMap(p)), 'value', { get: () => p(o.value).value });
export const combine = (sources) => Object.defineProperty(combineLatest(sources), 'value', { get: () => sources.map(s => s.value) });
export const pipe = (o, op) => Object.defineProperty(o.pipe(op), 'value', { get: () => o.value });
export const fromPromise = (p, value) => {
    const observable = new Observable(subs => {
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
export type KeyOf<T> = T extends any ? keyof T : never;
export type Merge<T, K extends KeyOf<T> = KeyOf<T>> = { [k in K]: T[k] };
export type PromiseCtr = {
  new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): PromiseLike<T>;
  all<T>(values: readonly (T | PromiseLike<T>)[]): PromiseLike<T[]>,
  resolve<T>(value: T | PromiseLike<T>): PromiseLike<T>;
  reject<T = never>(reason?: any): PromiseLike<T>;
}

export const runit = <R, N>(gen: Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr) => {
  const runThen = (...args: [] | [N]): PromiseLike<R> => {
    const v = args.length ? gen.next(args[0]) : gen.next();
    if (v.done) return promiseCtr.resolve(v.value);
    return promiseCtr.resolve(v.value).then(runThen);
  }; return runThen();
}

export function* wait<T>(x: T | PromiseLike<T>): Generator<T | PromiseLike<T>, T, T> {
  return yield x;
}

export function asAsync<T extends any[], R, U = void, N = any>(f: (this: U, ...args: T) => Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr, thisArg: U): (...args: T) => PromiseLike<R>;
export function asAsync<T extends any[], R, U = void, N = any>(f: (this: U | void, ...args: T) => Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr, thisArg?: U): (...args: T) => PromiseLike<R>;
export function asAsync<T extends any[], R, U = void, N = any>(f: (this: U, ...args: T) => Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr, thisArg: U): (...args: T) => PromiseLike<R> {
  return (...args: T) => runit(f.call(thisArg, ...args as T), promiseCtr);
}



export const guard = <T, V extends T>(x: T, cond: boolean): x is V => cond;
export const toKeyOf = <V>(x: keyof V) => x as KeyOf<V>;
export class Keys<K extends string | symbol | number> {
  readonly keys: K[];
  private _!: { [k in K]: null };
  constructor(o: { [k in K]: any }) { this.keys = Object.keys(o)/*.sort()*/ as K[]; }
  mapTo<V extends { [k in K]: any }>(mapper: <k extends K>(k: k, i: number) => V[k]): Pick<V, K> {
    const object = {} as Pick<V, K>;
    this.keys.forEach((k, i) => object[k] = mapper(k, i));
    return object;
  }
  asyncMapTo<V extends { [k in K]: any }>(mapper: <k extends K>(k: k) => PromiseLike<V[k]>, promiseCtr: PromiseCtr): PromiseLike<Pick<V, K>> {
    const object = {} as Pick<V, K>;
    return promiseCtr.all(this.keys.map(k => mapper(k).then(v => object[k] = v))).then(() => object);
  }
}

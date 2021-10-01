export type Rec<K extends keyof any> = Partial<Record<K, any>>;
export type TRec<K extends keyof any, KK extends Record<K, keyof any>> = { [k in K]: Record<KK[k], any> };

export type PromiseCtr = {
  new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void, onCancel?: (callback: () => void) => void) => void): PromiseLike<T>;
  all<T>(values: readonly (T | PromiseLike<T>)[]): PromiseLike<T[]>,
  resolve<T>(value: T | PromiseLike<T>): PromiseLike<T>;
  reject<T = never>(reason?: any): PromiseLike<T>;
}

export const runit = <R, N>(gen: Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr) => {
  const runThen = (...args: [] | [N] | [null, any]): PromiseLike<R> => {
    const v = args.length == 1 ? gen.next(args[0]) : args.length ? gen.throw(args[1]) : gen.next();
    if (v.done) return promiseCtr.resolve(v.value);
    return promiseCtr.resolve(v.value).then(runThen, err => runThen(null, err));
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

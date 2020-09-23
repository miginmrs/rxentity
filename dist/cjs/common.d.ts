export declare type KeyOf<T> = T extends any ? keyof T : never;
export declare type Merge<T, K extends KeyOf<T> = KeyOf<T>> = {
    [k in K]: T[k];
};
export declare type PromiseCtr = {
    new <T>(executor: (resolve: (value?: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void): PromiseLike<T>;
    all<T>(values: readonly (T | PromiseLike<T>)[]): PromiseLike<T[]>;
    resolve<T>(value: T | PromiseLike<T>): PromiseLike<T>;
    reject<T = never>(reason?: any): PromiseLike<T>;
};
export declare const runit: <R, N>(gen: Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr) => PromiseLike<R>;
export declare function wait<T>(x: T | PromiseLike<T>): Generator<T | PromiseLike<T>, T, T>;
export declare function asAsync<T extends any[], R, U = void, N = any>(f: (this: U, ...args: T) => Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr, thisArg: U): (...args: T) => PromiseLike<R>;
export declare function asAsync<T extends any[], R, U = void, N = any>(f: (this: U | void, ...args: T) => Generator<N | PromiseLike<N>, R, N>, promiseCtr: PromiseCtr, thisArg?: U): (...args: T) => PromiseLike<R>;
export declare const guard: <T, V extends T>(x: T, cond: boolean) => x is V;
export declare const toKeyOf: <V>(x: keyof V) => KeyOf<V>;
export declare class Keys<K extends string | symbol | number> {
    readonly keys: K[];
    private _;
    constructor(o: {
        [k in K]: any;
    });
    mapTo<V extends {
        [k in K]: any;
    }>(mapper: <k extends K>(k: k, i: number) => V[k]): Pick<V, K>;
    asyncMapTo<V extends {
        [k in K]: any;
    }>(mapper: <k extends K>(k: k) => PromiseLike<V[k]>, promiseCtr: PromiseCtr): PromiseLike<Pick<V, K>>;
}

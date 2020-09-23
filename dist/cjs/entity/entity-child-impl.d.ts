import { EntityFieldsFct, EntityFieldsMap, EntityAbstract } from "./entity-abstract";
import { Entity } from "./entity-proxies";
import { KeyOf, Merge } from "../common";
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template K union of initial field keys
 */
export declare class ChildEntityImpl<T, P extends T, V extends T, K extends KeyOf<T>> extends EntityAbstract<T, V> {
    readonly rx: EntityFieldsFct<T, V>;
    private createRx;
    readonly rxMap: EntityFieldsMap<T, V>;
    private rxSource;
    private rxSourceMap;
    private _parent;
    get parent(): Entity<P, any, EntityAbstract<P, any>> | undefined;
    get local(): Partial<Merge<T, KeyOf<T>>>;
    constructor(params: {
        data: V;
        parentPromise: {
            then: (setParent: (parent: Entity<P, any>) => void) => void;
        };
        parent?: undefined;
    } | {
        data: {
            [k in K]: V[k];
        };
        parent: Entity<P, any>;
    });
    setParent: (parent?: Entity<P, any, EntityAbstract<P, any>> | undefined) => void;
    readonly rewind: <K_1 extends keyof T>(field?: K_1 | undefined) => void;
    readonly levelOf: <K_1 extends KeyOf<T>>(field: K_1) => import("../valued-observable").ValuedObservable<number>;
}

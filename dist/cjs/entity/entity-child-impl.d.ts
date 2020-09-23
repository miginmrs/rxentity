import { EntityFieldsFct, EntityFieldsMap, EntityAbstract } from "./entity-abstract";
import { Entity } from "./entity-proxies";
import { Rec } from "../common";
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
export declare class ChildEntityImpl<K extends string, T extends Rec<K>, P extends T, V extends T, I extends K, PE extends Entity<K, P, any> = Entity<K, P, any>> extends EntityAbstract<K, T, V> {
    readonly rx: EntityFieldsFct<K, T, V>;
    private createRx;
    readonly rxMap: EntityFieldsMap<K, T, V>;
    private rxSource;
    private rxSourceMap;
    private _parent;
    get parent(): PE | undefined;
    get local(): Partial<Pick<T, K>>;
    constructor(params: {
        data: V;
        parentPromise: {
            then: (setParent: (parent: PE) => void) => void;
        };
        ready: false;
    } | {
        data: {
            [k in I]: V[k];
        };
        parent: PE;
        ready: true;
    });
    setParent: (parent?: PE | undefined) => void;
    readonly rewind: <SK extends K>(field?: SK | undefined) => void;
    readonly levelOf: <SK extends K>(field: SK) => import("../valued-observable").ValuedObservable<number>;
}

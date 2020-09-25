import { EntityFieldsFct, EntityFieldsMap, EntityAbstract } from "./entity-abstract";
import { ValuedObservable } from "rxvalue";
import { Entity } from "./entity-proxies";
import { Rec } from "../common";
/**
 * Child entity class
 * @template T map of fields output types
 * @template P map of fields parent output types
 * @template V map of fields input types
 * @template I union of initial field keys
 */
export declare class ChildEntityImpl<K extends string, T extends Rec<K>, V extends T, P extends T, pimpl extends EntityAbstract<K, P, any> = EntityAbstract<K, P, any>> extends EntityAbstract<K, T, V> {
    readonly rx: EntityFieldsFct<K, T, V>;
    private createRx;
    readonly rxMap: EntityFieldsMap<K, T, V>;
    private rxSource;
    private rxSourceMap;
    private _parent;
    get parent(): Entity<K, P, any, pimpl> | undefined;
    get local(): Partial<Pick<T, K>>;
    constructor(params: {
        data: V;
        parentPromise: {
            then: (setParent: (parent: Entity<K, P, any, pimpl>) => void) => void;
        };
        ready: false;
    } | {
        data: {
            [k in K]?: V[k];
        };
        parent: Entity<K, P, any, pimpl>;
        ready: true;
    });
    setParent: (parent?: Entity<K, P, any, pimpl> | undefined) => void;
    readonly rewind: <SK extends K>(field?: SK | undefined) => void;
    readonly levelOf: <SK extends K>(field: SK) => ValuedObservable<number>;
}

import { KeyOf } from "../common";
import { EntityAbstract, EntityFieldsFct, EntityFieldsMap } from "./entity-abstract";
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare class EntityImpl<T, V extends T> extends EntityAbstract<T, V> {
    readonly rx: EntityFieldsFct<T, V>;
    readonly rxMap: EntityFieldsMap<T, V>;
    get local(): import("../common").Merge<T, KeyOf<T>>;
    constructor(e: V);
}

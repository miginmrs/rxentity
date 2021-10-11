import { Rec } from "..";
import { EntityAbstract, EntityFieldsFct, EntityFieldsMap } from "./entity-abstract";
/**
 * Top level entity class
 * @template T map of fields output types
 * @template V map of fields input types
 */
export declare class EntityImpl<K extends string, T extends Rec<K>, V extends T, S> extends EntityAbstract<K, T, V, S> {
    readonly rx: EntityFieldsFct<K, T, V>;
    readonly rxMap: EntityFieldsMap<K, T, V>;
    get local(): Pick<T, K>;
    constructor(e: V, store: S);
}

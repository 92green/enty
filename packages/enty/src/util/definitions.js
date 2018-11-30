/* @flow */
/* eslint-disable no-unused-vars */

/**
 * NormalizeStateObjects is the result of calling normalize on a schema.
 *
 * @property entities
 * The entities found in the data shape of this schema
 *
 * @property result
 * A normalized representation of the data. Each entity is replaced by it's ID.
 *
 * @property schemas
 * The schemas used in this normalization.
 */
export type NormalizeState = {
    entities: Object,
    result: any,
    schemas: Object
};

/**
 * DenormalizeState description
 */
export type DenormalizeState = {
    entities: Object,
    result: any
};


/**
 * KeyedDefinition description
 *
 */
export type KeyedDefinition = {
    [string]: Schema<*>
};

/**
 * ChildDefinition description
 */
export type ChildDefinition = Schema<*>;


/**
 * Structure description
 */
export type Structure = {
    constructor: Function,
    denormalizeFilter: Function,
    merge: Function
};

/**
 * Entity description
 */
export type Entity = {
    idAttribute: Function,
    name: string
};

/**
 * StructureInput description
 */
export type StructureInput = {
    definition?: ChildDefinition|KeyedDefinition,
    constructor?: Function,
    denormalizeFilter?: Function,
    merge?: Function
};

/**
 * EntitySchemaOptions description
 * @property definition - A Structure schema
 * @property idAttribute - A function that returns the identifying feature of the entity
 */
export type EntitySchemaOptions = {
    definition: Schema<Structure>,
    name?: string,
    idAttribute?: (entity: Object) => string
};

/**
 * SchemaInterface
 *
 */
export interface Schema<Options> {
    normalize(data: *, entities: Object, context?: *): NormalizeState,
    denormalize(denormalizeState: DenormalizeState, path: Array<*>): any,
    options: Options,
    definition: *,
    type?: string
}




/* @flow */
/* eslint-disable no-unused-vars */

/**
 * DenormalizeState description
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
 */
export type KeyedDefinition = {
    [string]: Schema<*>
};

/**
 * ChildDefinition description
 */
export type ChildDefinition = Schema<*>;



export type Structure = {
    constructor: Function,
    denormalizeFilter: Function,
    merge: Function
};

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
 * EntityInput description
 */
export type EntityInput = {
    definition?: Schema<Structure>,
    name?: string,
    idAttribute?: Function
};


export interface Schema<Options> {
    normalize(data: *, entities: Object): NormalizeState,
    denormalize(denormalizeState: DenormalizeState, path: Array<*>): any,
    options: Options,
    definition: *,
    type?: string
}

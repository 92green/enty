/* @flow */
/* eslint-disable no-unused-vars */

export type NormalizeState = {
    entities: Object,
    result: any,
    schemas: Object
};

export type DenormalizeState = {
    entities: Object,
    result: any
};

export type KeyedDefinition = {
    [string]: Schema<*>
};

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


export type StructureInput = {
    definition?: ChildDefinition|KeyedDefinition,
    constructor?: Function,
    denormalizeFilter?: Function,
    merge?: Function
};

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

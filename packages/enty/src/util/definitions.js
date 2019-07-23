// @flow

export type NormalizeState = {
    entities: Object,
    result: any,
    schemas: Object
};

export type DenormalizeState = {
    entities: Object,
    result: any
};

export type StructuralSchemaOptions = {
    create?: Create,
    merge?: Merge
};

export type EntitySchemaOptions = {
    shape?: StructuralSchemaInterface,
    idAttribute?: (entity: Object) => string
};

export type KeyedShape = {
    [key: string]: StructuralSchemaInterface|EntitySchemaInterface
};

export type DynamicShape = <A>(data: <A>) => EntitySchemaInterface|StructuralSchemaInterface;

//
// Options

export type Normalize = (data: mixed, entities: Object) => NormalizeState;
export type Denormalize = (denormalizeState: DenormalizeState, path: Array<mixed>) => any;
export type Create = <A, B>(a: A) => B;
export type Merge = <A, B, C>(a: A, b: B) => C;
export type DenormalizeFilter = <A>(a: A) => boolean;
export type IdAttribute = (data: mixed) => string;


//
// Interfaces

export interface EntitySchemaInterface {
    +normalize: Normalize,
    +denormalize: Denormalize,
    name: string,
    shape?: StructuralSchemaInterface,
    idAttribute: (item: mixed) => string
}

export interface StructuralSchemaInterface {
    +normalize: Normalize,
    +denormalize: Denormalize,
    shape: StructuralSchemaInterface|EntitySchemaInterface,
    create: Create,
    merge: Merge,
    denormalizeFilter: DenormalizeFilter
}




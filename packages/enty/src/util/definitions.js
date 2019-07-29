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

export type CompositeEntitySchemaOptions = {
    shape?: EntitySchemaInterface,
    idAttribute?: (entity: Object) => string,
    compositeKeys?: {
        [key: string]: EntitySchemaInterface
    }
};

export type KeyedShape = {
    [key: string]: StructuralSchemaInterface|EntitySchemaInterface
};


export type DynamicShape = (data: any) => SchemaInterface;


//
// Options

export type Normalize = (data: mixed, entities: Object) => NormalizeState;
export type Denormalize = (denormalizeState: DenormalizeState, path: Array<mixed>) => any;
export type Create = (data: *) => *;
export type Merge = (previous: *, next: *) => *;
export type IdAttribute = (data: *) => string;


//
// Interfaces

export interface EntitySchemaInterface {
    +normalize: Normalize,
    +denormalize: Denormalize,
    +shape: StructuralSchemaInterface,
    name: string,
    idAttribute: (item: mixed) => string
}

export interface StructuralSchemaInterface {
    +normalize: Normalize,
    +denormalize: Denormalize,
    create: Create,
    merge: Merge
}

export interface SchemaInterface {
    +normalize: Normalize,
    +denormalize: Denormalize
}

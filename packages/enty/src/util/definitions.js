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

export type EntitySchemaOptions<Shape> = {
    +shape?: Shape,
    idAttribute?: (entity: Object) => string
};

export type CompositeEntitySchemaOptions<Shape, CompositeShape> = {
    shape?: Shape,
    idAttribute?: (entity: Object) => string,
    compositeKeys?: CompositeShape
};



export type DynamicShape = (data: any) => Schema;


//
// Options

export type Normalize = (data: mixed, entities: Object) => NormalizeState;
export type Denormalize = (denormalizeState: DenormalizeState, path: Array<mixed>) => any;
export type Create = (data: *) => *;
export type Merge = (previous: *, next: *) => *;
export type IdAttribute = (data: *) => string;


//
// Interfaces

export interface EntitySchemaInterface<Shape> {
    +normalize: Normalize,
    +denormalize: Denormalize,
    shape: Shape,
    name: string,
    idAttribute: (item: mixed) => string
}

export interface StructuralSchemaInterface<Shape> {
    +normalize: Normalize,
    +denormalize: Denormalize,
    shape: Shape,
    create: Create,
    merge: Merge
}

export interface Schema {
    +normalize: Normalize,
    +denormalize: Denormalize
}

export type Entities = Record<string, Record<string, any>>;

export type NormalizeState = {
    entities: Entities;
    result: any;
    schemas: Object;
};

export type DenormalizeState = {
    entities: Object;
    result: any;
};

export type StructuralSchemaOptions = {
    create?: Create;
    merge?: Merge;
};

export type EntitySchemaOptions<Shape> = {
    readonly shape?: Shape;
    id?: (entity: Object) => string;
    merge?: Merge;
};

export type CompositeEntitySchemaOptions<Shape, CompositeShape> = {
    shape?: Shape;
    id?: (entity: Object) => string;
    compositeKeys?: CompositeShape;
};

export type DynamicShape = (data: any) => Schema;

//
// Options

export type Normalize = (data: Object, entities: Entities) => NormalizeState;
export type Denormalize = (denormalizeState: DenormalizeState, path?: Array<unknown>) => any;
export type Create = (data: any) => any;
export type Merge = (previous: any, next: any) => any;
export type IdAttribute = (data: any) => string;

//
// Interfaces

export interface EntitySchemaInterface<Shape> {
    readonly normalize: Normalize;
    readonly denormalize: Denormalize;
    shape: Shape;
    name: string;
    id: (item: unknown) => string;
}

export interface StructuralSchemaInterface<Shape> {
    readonly normalize: Normalize;
    readonly denormalize: Denormalize;
    shape: Shape;
    create: Create;
    merge: Merge;
}

export interface Schema {
    readonly normalize: Normalize;
    readonly denormalize: Denormalize;
}
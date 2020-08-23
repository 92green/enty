type Meta = Record<string, any>;
type State = Record<string, Record<string, any>>;
type SchemasUsed = Record<string, Schema>;

export type NormalizeParams = {
    input: any;
    state: State;
    meta: Meta;
};

export type NormalizeReturn = {
    output: any;
    state: State;
    schemasUsed: SchemasUsed;
};

export type DenormalizeParams = {
    output: any;
    state: State;
    path?: Array<unknown>;
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

export type Normalize = (params: NormalizeParams) => NormalizeReturn;
export type Denormalize = (params: DenormalizeParams) => any;
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

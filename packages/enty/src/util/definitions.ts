import EntitySchema from '../EntitySchema';
import DynamicSchema from '../DynamicSchema';

export type Entities = {
    [key: string]: {
        [key: string]: unknown;
    };
};

export type NormalizeState = {
    entities: Entities;
    result: any;
    schemas: Object;
};

export type DenormalizeState = {
    entities: Entities;
    result: any;
};

//export type StructuralSchemaOptions<Create, Merge> = {
//create?: Create
//merge?: Merge
//}

export type EntitySchemaOptions<Shape> = {
    name: string;
    shape?: Shape;
    id?: (entity: Object) => string;
};

//export type CompositeEntitySchemaOptions<Shape, CompositeShape> = {
//shape?: Shape
//id?: (entity: Object) => string
//compositeKeys?: CompositeShape
//}

//export type DynamicShape = (data: any) => Schema

//
// Options

export type Normalize = (data: unknown, entities: Object) => NormalizeState;
export type Denormalize = (denormalizeState: DenormalizeState, path?: Array<unknown>) => any;
//export type Create = (data: any) => any
//export type Merge = (previous: any, next: any) => any
export type Id = (data: any) => string;

//
// Interfaces

export type Schema = ShapeSchema<any> | EntitySchema<any> | DynamicSchema<any>;

export interface ShapeSchema<Shape> {
    normalize: Normalize;
    denormalize: Denormalize;
    shape: Shape;
    create: Function;
    merge: Function;
}

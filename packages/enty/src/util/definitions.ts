export type Entities = Record<
    string,
    Record<
        string,
        {
            normalizedAt: number;
            data: unknown;
        }
    >
>;

export type NormalizeState = {
    entities: Entities;
    result: any;
    schemas: Record<string, Schema<any>>;
};

export type DenormalizeState = {
    entities: Entities;
    result: any;
};

//
// Options

//
// Interfaces

export interface Schema<T> {
    normalize: (data: T, entities: Entities) => NormalizeState;
    denormalize: (data: DenormalizeState, path?: Array<unknown>) => T | null;
}

export interface Entity<T, Shape> extends Schema<T> {
    name: string;
    id: (item: T) => string;
    shape: Shape | null;
}

export interface Structure<T> extends Schema<T> {
    /** @deprecated */
    create: (value: T) => T;
    merge: (previous: T, next: T) => T;
}

export type StructureOptions<T> = {
    create?: (value: T) => T;
    merge?: (previous: T, next: T) => T;
};

import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {Structure} from './util/definitions';
import {StructureOptions} from './util/definitions';
import {Schema} from './util/definitions';
import {Entities} from './util/definitions';
import REMOVED_ENTITY from './util/RemovedEntity';

export default class ArraySchema<T extends Array<any>> implements Structure<T> {
    shape: Schema<T[number]>;
    create: (next: T) => T;
    merge: (previous: T, next: T) => T;

    constructor(shape: Schema<T[number]>, options: StructureOptions<T> = {}) {
        this.shape = shape;
        this.merge = options.merge || ((_, bb) => bb);
        this.create = options.create || ((aa) => aa);
    }

    normalize(data: T, entities: Entities = {}): NormalizeState {
        let schemas = {};

        const result = data.map((item: any): any => {
            const {result, schemas: childSchemas} = this.shape.normalize(item, entities);
            Object.assign(schemas, childSchemas);
            return result;
        });

        return {entities, schemas, result: this.create(result as T)};
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): T | null {
        const {result, entities} = denormalizeState;

        if (result == null) return result;

        return result
            .map((item: unknown) => {
                return this.shape.denormalize({result: item, entities}, path);
            })
            .filter((ii: unknown) => {
                return ii !== REMOVED_ENTITY;
            });
    }
}

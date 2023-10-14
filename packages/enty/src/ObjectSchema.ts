import {NormalizeState, Structure} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {Entities} from './util/definitions';
import {Schema} from './util/definitions';
import {StructureOptions} from './util/definitions';
import REMOVED_ENTITY from './util/RemovedEntity';

export default class ObjectSchema<T extends Record<string, unknown>> implements Structure<T> {
    create: (value: T) => T;
    merge: (previous: T, next: T) => T;
    relations: Partial<Record<keyof T, Schema<any>>>;

    constructor(
        relations: Partial<Record<keyof T, Schema<any>>>,
        options: StructureOptions<T> = {}
    ) {
        this.relations = relations;
        this.create = options.create || ((item) => ({...item}));
        this.merge = options.merge || ((previous, next) => ({...previous, ...next}));
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(data: T, entities: Entities = {}): NormalizeState {
        const {relations} = this;
        const dataMap = data;
        let schemas = {};

        const result = Object.keys(relations).reduce((result: Object, key: any): any => {
            const value = dataMap[key];
            const schema = relations[key];
            if (!schema) throw new Error(`${String(key)} was not defined in shape`);
            if (value) {
                const {result: childResult, schemas: childSchemas} = schema.normalize(
                    value,
                    entities
                );
                Object.assign(schemas, childSchemas);
                result = {...result, [key]: childResult};
            }

            return result;
        }, dataMap) as T;

        return {entities, schemas, result: this.create(result)};
    }

    /**
     * ObjectSchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): T | null {
        const {result, entities} = denormalizeState;
        const {relations} = this;

        if (result == null || result === REMOVED_ENTITY) {
            return result;
        }

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        let item: T = {...result};
        if (path.indexOf(this) !== -1) {
            return item;
        }

        for (let key in relations) {
            const schema = relations[key];
            const result = item[key];
            const value = schema?.denormalize({result, entities}, [...path, this]);

            if (value !== REMOVED_ENTITY && value != undefined) {
                item[key] = value;
            } else {
                delete item[key];
            }
        }

        return item;
    }
}

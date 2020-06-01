import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {ShapeSchema} from './util/definitions';
import {Entities} from './util/definitions';
import REMOVED_ENTITY from './util/RemovedEntity';

export default class ObjectSchema<A> implements ShapeSchema<A> {
    shape: A;

    constructor(shape: A) {
        this.shape = shape;
    }

    create(data: Object) {
        return {...data};
    }

    merge(previous: Object, next: Object) {
        return {...previous, ...next};
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(data: Object, entities: Entities = {}): NormalizeState {
        const {shape} = this;
        const dataMap = {...data};
        let schemas = {};

        const result = Object.keys(shape).reduce((result: Object, key: any): any => {
            const value = dataMap[key];
            const schema = shape[key];
            if (value) {
                const {result: childResult, schemas: childSchemas} = schema.normalize(
                    value,
                    entities
                );
                Object.assign(schemas, childSchemas);
                result[key] = childResult;
            }

            return result;
        }, dataMap);

        return {entities, schemas, result: this.create(result)};
    }

    /**
     * ObjectSchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {result, entities} = denormalizeState;
        let item = {...result};
        const {shape} = this;

        if (result == null || result === REMOVED_ENTITY) {
            return result;
        }

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        if (path.indexOf(this) !== -1) {
            return item;
        }

        const keys = Object.keys(shape);

        for (let key of keys) {
            const schema = shape[key];
            const result = item[key];
            const value = schema.denormalize({result, entities}, [...path, this]);

            if (value !== REMOVED_ENTITY && value !== undefined) {
                item[key] = value;
            } else {
                delete item[key];
            }
        }

        return item;
    }
}

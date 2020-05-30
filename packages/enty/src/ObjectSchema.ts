import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {ShapeSchema} from './util/definitions';
import {Entities} from './util/definitions';

import clone from 'unmutable/clone';
import get from 'unmutable/get';
import del from 'unmutable/delete';
import set from 'unmutable/set';
import pipeWith from 'unmutable/pipeWith';
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
    normalize(data: unknown, entities: Entities = {}): NormalizeState {
        const {shape} = this;
        const dataMap = data;
        let schemas = {};

        const result = Object.keys(shape).reduce((result: Object, key: any): any => {
            const value = get(key)(dataMap);
            const schema = get(key)(shape);
            if (value) {
                const {result: childResult, schemas: childSchemas} = schema.normalize(
                    value,
                    entities
                );
                Object.assign(schemas, childSchemas);
                result = set(key, childResult)(result);
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
        const {shape} = this;

        if (result == null || result === REMOVED_ENTITY) {
            return result;
        }

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        return pipeWith(
            result,
            clone(),
            (item: Object): Object => {
                if (path.indexOf(this) !== -1) {
                    return item;
                }

                const keys = Object.keys(shape);

                for (let key of keys) {
                    const schema = get(key)(shape);
                    const result = get(key)(item);
                    const value = schema.denormalize({result, entities}, [...path, this]);

                    if (value !== REMOVED_ENTITY && value !== undefined) {
                        item = set(key, value)(item);
                    } else {
                        item = del(key)(item);
                    }
                }

                return item;
            }
        );
    }
}

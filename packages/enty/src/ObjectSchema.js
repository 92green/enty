// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {KeyedShape} from './util/definitions';
import type {Create} from './util/definitions';
import type {Merge} from './util/definitions';
import type {StructuralSchemaOptions} from './util/definitions';
import type {StructuralSchemaInterface} from './util/definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import del from 'unmutable/lib/delete';
import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {DELETED_ENTITY} from './util/SchemaConstant';


export default class ObjectSchema implements StructuralSchemaInterface {
    create: Create;
    merge: Merge;
    shape: KeyedShape;

    constructor(shape: KeyedShape, options?: StructuralSchemaOptions = {}) {
        this.shape = shape;
        this.create = options.create || (item => ({...item}));
        this.merge = options.merge || ((previous, next) => ({...previous, ...next}));
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {shape} = this;
        const dataMap = this.create(data);
        let schemas = {};

        const result = Object.keys(shape)
            .reduce((result: Object, key: *): any => {
                const value = get(key)(dataMap);
                const schema = get(key)(shape);
                if(value) {
                    const {result: childResult, schemas: childSchemas} = schema.normalize(value, entities);
                    Object.assign(schemas, childSchemas);
                    result = set(key, childResult)(result);
                }

                return result;
            }, dataMap);

        return {entities, schemas, result};

    }

    /**
     * ObjectSchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {result, entities} = denormalizeState;
        const {shape} = this;

        if(result == null || result === DELETED_ENTITY) {
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
                if(path.indexOf(this) !== -1) {
                    return item;
                }
                return Object.keys(shape)
                    .reduce((newItem: Object, key: string): Object => {
                        const schema = get(key)(shape);
                        const result = get(key)(newItem);
                        const value = schema.denormalize({result, entities}, [...path, this]);

                        if(value !== DELETED_ENTITY) {
                            newItem = set(key, value)(newItem);
                        } else {
                            newItem = del(key)(newItem);
                        }

                        return newItem;
                    }, item);
            }
        );
    }
}

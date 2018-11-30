// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {KeyedDefinition} from './util/definitions';
import type {Schema} from './util/definitions';
import type {Structure} from './util/definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import del from 'unmutable/lib/delete';
import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {DELETED_ENTITY, type DeletedEntity} from './util/SchemaConstant';
import Keyed from './abstract/Keyed';

/**
 * The ObjectSchema is a structural schema used to define relationships in objects.
 *
 * @example
 * const user = entity('user');
 * user.set(ObjectSchema({
 *     friends: ListSchema(user)
 * }))
 *
 * @param definition - an object describing any entity relationships that should be traversed.
 * @param options
 *
 */
export class ObjectSchema extends Keyed implements Schema<Structure> {
    options: Structure;

    constructor(definition: KeyedDefinition = {}, options: Object = {}) {
        super(definition);
        this.options = {
            constructor: item => ({...item}),
            denormalizeFilter: item => item && !item.deleted,
            merge: (previous, next) => ({...previous, ...next}),
            ...options
        };
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(data: Object, entities: Object = {}, context: * = {}): NormalizeState {
        const {definition} = this;
        const dataMap = this.options.constructor(data);
        let schemas = {};

        const result = this.keys
            .reduce((result: Object, key: *): any => {
                const value = get(key)(dataMap);
                const schema = get(key)(definition);
                if(value) {
                    const {result: childResult, schemas: childSchemas} = schema.normalize(value, entities, context);
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
        const {definition, options} = this;
        let deletedKeys = [];

        if(result == null) {
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
                return this.keys
                    .reduce((newItem: Object, key: string): Object => {
                        const schema = get(key)(definition);
                        const result = get(key)(newItem);
                        const value = schema.denormalize({result, entities}, path.concat(this));

                        if(value !== DELETED_ENTITY) {
                            newItem = set(key, value)(newItem);
                        } else {
                            newItem = del(key)(newItem);
                            deletedKeys.push(key);
                        }

                        return newItem;
                    }, item);
            },
            (item: Object): Object|DeletedEntity => {
                return options.denormalizeFilter(item, deletedKeys) ? item : DELETED_ENTITY;
            }
        );
    }
}

/**
 * ObjectSchemaFactory
 */
export default function ObjectSchemaFactory(...args: any[]): ObjectSchema {
    return new ObjectSchema(...args);
}

// @flow
import clone from 'unmutable/lib/clone';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {DELETED_ENTITY, type DeletedEntity} from './util/SchemaConstant';
import Keyed from './abstract/Keyed';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {KeyedDefinition} from './util/definitions';
import type {Schema} from './util/definitions';
import type {Structure} from './util/definitions';

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
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const dataMap = this.options.constructor(data);
        let schemas = {};

        const result = Object.entries(dataMap)
            .reduce((result: Object, [key]: *): any => {
                if(definition[key] && dataMap[key]) {
                    const {result: childResult, schemas: childSchemas} = definition[key].normalize(dataMap[key], entities);
                    Object.assign(schemas, childSchemas);
                    result[key] = childResult;
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

        let keys: string[] = Object.keys(result);

        return pipeWith(
            result,
            clone(),
            (item: Object): Object => {
                if(path.indexOf(this) !== -1) {
                    return item;
                }
                return keys
                    .reduce((newItem: Object, key: string): Object => {
                        if(definition[key]) {
                            let result = newItem[key];
                            newItem[key] = definition[key].denormalize({result, entities}, path.concat(this));
                        }
                        return newItem;
                    }, item);
            },
            (item: any): any => {
                return keys
                    .reduce((newItem: Object, deleteKey: string): Object => {
                        if(item[deleteKey] === DELETED_ENTITY) {
                            deletedKeys.push(deleteKey);
                            delete newItem[deleteKey];
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

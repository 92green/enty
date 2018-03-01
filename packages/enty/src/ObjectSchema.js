// @flow
import {IdentityFactory as Identity} from 'fronads/lib/Identity';
import {DELETED_ENTITY, type DeletedEntity} from './SchemaConstant';
import type {NormalizeState} from '../definitions';
import type {DenormalizeState} from '../definitions';

/**
 * @module Schema
 */

/**
 * ObjectSchema
 *
 * @memberof module:Schema
 */
export class ObjectSchema {
    type: string;
    definition: Object;
    options: Object;

    /**
     * The ObjectSchema is a structural schema used to define relationships in objects.
     *
     * @example
     * const user = entity('user');
     * user.define(ObjectSchema({
     *     friends: ListSchema(user)
     * }))
     *
     * @param {Object} definition - an object describing any entity relationships that should be traversed.
     * @param {Object} options
     *
     */
    constructor(definition: Object = {}, options: Object = {}) {
        this.type = 'object';
        this.definition = definition;
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
        return Identity(result)
            .map((item: Object): Object => {
                return Object.entries(item)
                    .reduce((newItem: Object, [key]: *): Object => {
                        var value = newItem[key];
                        var newValue;

                        if(path.indexOf(this) !== -1) {
                            newValue = value;
                        } else if(definition[key]) {
                            newValue = definition[key].denormalize({result: value, entities}, path.concat(this));
                        } else {
                            newValue = value;
                        }

                        newItem[key] = newValue;
                        return newItem;
                    }, item);
            })
            .map((item: any): any => {
                return Object.entries(item)
                    .filter(([key]) => item[key] === DELETED_ENTITY)
                    .reduce((newItem: Object, [deleteKey]: *): Object => {
                        deletedKeys.push(deleteKey);
                        delete newItem[deleteKey];
                        return newItem;
                    }, item);
            })
            .map((item: Object): Object|DeletedEntity => {
                return options.denormalizeFilter(item, deletedKeys) ? item : DELETED_ENTITY;
            })
            .value();
    }
    merge(objectSchema: Object): ObjectSchema {
        return new ObjectSchema(
            Object.assign({}, this.definition, objectSchema.definition),
            Object.assign({}, this.options, objectSchema.options)
        );
    }
}

export default function ObjectSchemaFactory(...args: any[]): ObjectSchema {
    return new ObjectSchema(...args);
}

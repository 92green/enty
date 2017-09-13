// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY, type DeletedEntity} from './SchemaConstant';
import type {NormalizeState} from '../definitions';

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
     *     friends: ArraySchema(user)
     * }))
     *
     * @param {Object} definition - an object describing any entity relationships that should be traversed.
     * @param {Object} options
     *
     */
    constructor(definition: Object, options: Object = {}) {
        this.type = 'object';
        this.definition = definition;
        this.options = {
            denormalizeFilter: () => true,
            ...options
        };
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const dataMap = Map(data);
        let schemas = {};

        const result = dataMap
            .keySeq()
            .reduce((result: Object, key: string): any => {
                if(definition[key] && dataMap.get(key)) {
                    const {result: childResult, schemas: childSchemas} = definition[key].normalize(dataMap.get(key), entities);
                    Object.assign(schemas, childSchemas);
                    return result.set(key, childResult);
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
        //
        // Lots of `item.keySeq().reduce(() => {}, item) because Immutable can't map records without
        // mutating them...
        return result
            .update((item: Map<any, any>): Map<any, any> => {
                return item.keySeq()
                    .reduce((newItem: any, key: string): Map<any, any> => {
                        var value = newItem.get(key);
                        var newValue;

                        if(path.indexOf(this) !== -1) {
                            newValue = value;
                        } else if(definition[key]) {
                            newValue = definition[key].denormalize({result: value, entities}, path.concat(this));
                        } else {
                            newValue = value;
                        }

                        return newItem.set(key, newValue);
                    }, item);
            })
            .update((item: any): any => {
                return item.keySeq()
                    .filter(key => item.get(key) === DELETED_ENTITY)
                    .reduce((newItem: Map<any, any>, deleteKey: string): Map<any, any> => {
                        deletedKeys.push(deleteKey);
                        return newItem.delete(deleteKey);
                    }, item);
            })
            .update((ii: Map<any, any>): Map<any, any>|DeletedEntity => {
                return options.denormalizeFilter(ii, deletedKeys) ? ii : DELETED_ENTITY;
            });
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

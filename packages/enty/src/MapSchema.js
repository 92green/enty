// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY, type DeletedEntity} from './util/SchemaConstant';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';

/**
 * @module Schema
 */

/**
 * MapSchema
 *
 * @memberof module:Schema
 */
export class MapSchema {
    type: string;
    definition: Object;
    options: Object;

    /**
     * The MapSchema is a structural schema used to define relationships in objects.
     *
     * @example
     * const user = entity('user');
     * user.define(MapSchema({
     *     friends: ListSchema(user)
     * }))
     *
     * @param {Object} definition - an object describing any entity relationships that should be traversed.
     * @param {Object} options
     *
     */
    constructor(definition: Object = {}, options: Object = {}) {
        this.type = 'map';
        this.definition = definition;
        this.options = {
            ...this.options,
            constructor: item => Map(item),
            denormalizeFilter: item => item && !item.get('deleted'),
            merge: (previous, next) => previous.merge(next),
            ...options
        };
    }

    /**
     * MapSchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const dataMap = this.options.constructor(data);
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
     * MapSchema.denormalize
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
    merge(mapSchema: Object): MapSchema {
        return new MapSchema(
            Object.assign({}, this.definition, mapSchema.definition),
            Object.assign({}, this.options, mapSchema.options)
        );
    }
}

export default function MapSchemaFactory(...args: any[]): MapSchema {
    return new MapSchema(...args);
}

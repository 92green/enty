// @flow
import {Map} from 'immutable';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {DELETED_ENTITY, type DeletedEntity} from './util/SchemaConstant';
import Keyed from './abstract/Keyed';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {KeyedDefinition} from './util/definitions';
import type {Schema} from './util/definitions';
import type {Structure} from './util/definitions';
import type {StructureInput} from './util/definitions';

/**
 * The MapSchema is a structural schema used to define relationships in objects.
 *
 * @example
 * const user = entity('user');
 * user.set(MapSchema({
 *     friends: ListSchema(user)
 * }))
 *
 * @param {Object} definition - an object describing any entity relationships that should be traversed.
 * @param {Object} options
 *
 */
export class MapSchema extends Keyed implements Schema<Structure> {
    options: Structure;
    constructor(definition: KeyedDefinition = {}, options: StructureInput = {}) {
        super(definition);
        this.options = {
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

        // If we are at the root level use the result keys,
        // That will always be smaller than the schema. Once past the root level
        // the schemas keys will be less than the value
        let keys: string[] = path.length ? Object.keys(this.definition) : [...result.keys()];

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        return pipeWith(
            result,
            (item: Map<any, any>): Map<any, any> => {
                if(path.indexOf(this) !== -1) {
                    return item;
                }
                return keys
                    .reduce((newItem: any, key: string): Map<any, any> => {
                        if(definition[key]) {
                            let result = newItem.get(key);
                            let newValue = definition[key].denormalize({result, entities}, path.concat(this));
                            return newItem.set(key, newValue);
                        }
                        return newItem;
                    }, item);
            },
            (item: any): any => {
                return keys
                    .reduce((newItem: Map<any, any>, deleteKey: string): Map<any, any> => {
                        if(item.get(deleteKey) === DELETED_ENTITY) {
                            deletedKeys.push(deleteKey);
                            return newItem.delete(deleteKey);
                        }
                        return newItem;
                    }, item);
            },
            (ii: Map<any, any>): Map<any, any>|DeletedEntity => {
                return options.denormalizeFilter(ii, deletedKeys) ? ii : DELETED_ENTITY;
            }
        );
    }
}

export default function MapSchemaFactory(...args: any[]): MapSchema {
    return new MapSchema(...args);
}

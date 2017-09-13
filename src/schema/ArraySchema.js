// @flow
import {List} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';
import type {NormalizeState} from '../definitions';

/**
 * @module Schema
 */

/**
 * ArraySchema
 *
 * @memberof module:Schema
 */
export class ArraySchema {
    type: string;
    definition: Object;
    options: Object;

    /**
     * @param {Schema} definition
     */
    constructor(definition: Object, options: Object = {}) {
        this.type = 'array';
        this.definition = definition;
        this.options = {
            ...options
        };
    }

    /**
     * ArraySchema.normalize
     */
    normalize(data: Array<any>, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const idAttribute = definition.options.idAttribute;
        let schemas = {};
        const result = List(data)
            .map((item: any): any => {
                const {result, schemas: childSchemas} = definition.normalize(item, entities);

                // preserve our shcemas map
                Object.assign(schemas, childSchemas);

                // If our result is our item that means we have prenoramlized data.
                if(result === item || definition.type !== 'entity') {
                    return result;
                }

                return idAttribute(item).toString();
            });

        return {entities, schemas, result};
    }

    /**
     * ArraySchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {result, entities} = denormalizeState;
        const {definition} = this;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item: any): any => {
                return definition.denormalize({result: item, entities}, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}

export default function ArraySchemaFactory(...args: any[]): ArraySchema {
    return new ArraySchema(...args);
}

// @flow
import {List} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';
import type {NormalizeState} from '../definitions';
import type {DenormalizeState} from '../definitions';

/**
 * @module Schema
 */

/**
 * ListSchema
 *
 * @memberof module:Schema
 */
export class ListSchema {
    type: string;
    definition: Object;
    options: Object;

    /**
     * @param {Schema} definition
     */
    constructor(definition: Object, options: Object = {}) {
        this.type = 'list';
        this.definition = definition;
        this.options = {
            constructor: item => List(item),
            merge: (previous, next) => previous.merge(next),
            ...options
        };
    }

    /**
     * ListSchema.normalize
     */
    normalize(data: Array<any>, entities: Object = {}): NormalizeState {
        const {definition} = this;
        // const idAttribute = definition.options.idAttribute;
        let schemas = {};
        const result = List(data)
            .map((item: any): any => {
                const {result, schemas: childSchemas} = definition.normalize(item, entities);

                // add child schemas to the schema collection
                Object.assign(schemas, childSchemas);

                return result;
            });

        return {entities, schemas, result};
    }

    /**
     * ListSchema.denormalize
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

export default function ListSchemaFactory(...args: any[]): ListSchema {
    return new ListSchema(...args);
}

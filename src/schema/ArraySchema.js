// @flow
import {List} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';

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
    childSchema: Object;
    options: Object;

    /**
     * @param {Schema} childSchema
     */
    constructor(childSchema: Object, options: Object = {}) {
        this.type = 'array';
        this.childSchema = childSchema;
        this.options = {
            ...options
        };
    }

    /**
     * ArraySchema.normalize
     */
    normalize(data: Array<any>, entities: Object = {}): NormalizeState {
        const {childSchema} = this;
        const idAttribute = childSchema.options.idAttribute;
        const result = List(data)
            .map((item: any): any => {
                const {result} = childSchema.normalize(item, entities);
                return (childSchema.type === 'entity')
                    ? idAttribute(item).toString()
                    : result;
            });

        return {entities, result};
    }

    /**
     * ArraySchema.denormalize
     */
    denormalize(normalizeState: NormalizeState, path: string[] = []): any {
        const {result, entities} = normalizeState;
        const {childSchema} = this;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item: any): any => {
                return childSchema.denormalize({result: item, entities}, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}

export default function ArraySchemaFactory(...args: any[]): ArraySchema {
    return new ArraySchema(...args);
}

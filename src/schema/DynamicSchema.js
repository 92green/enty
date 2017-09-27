// @flow
import type {NormalizeState} from '../definitions';

/**
 * @module Schema
 */

/**
 * DynamicSchema
 *
 * @memberof module:Schema
 */
export class DynamicSchema {
    type: string;
    options: Object;
    constructor(definition: Function, options: Object = {}) {
        this.type = 'dynamic';
        this.options = {
            definition,
            ...options
        };
    }

    /**
     * DynamicSchema.define
     */
    define(definition: any): DynamicSchema {
        this.options.definition = definition;
        return this;
    }

    /**
     * DynamicSchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const definitionSchema = this.options.definition(data);
        return {
            entities,
            result: {
                resultType: 'dynamicSchemaResult',
                definitionResult: definitionSchema.normalize(data, entities),
                definitionSchema
            }
        };
    }

    /**
     * DynamicSchema.denormalize
     */
    denormalize(normalizeState: NormalizeState, path: Array<*> = []): any {
        const {definitionResult, definitionSchema} = normalizeState.result;
        return definitionSchema.denormalize(definitionResult, path);
    }
}

export default function DynamicSchemaFactory(...args: any[]): DynamicSchema {
    return new DynamicSchema(...args);
}

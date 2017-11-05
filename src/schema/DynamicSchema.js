// @flow
import type {NormalizeState} from '../definitions';
import type {DenormalizeState} from '../definitions';

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
        const definitionResult = definitionSchema.normalize(data, entities);

        return {
            entities,
            schemas: definitionResult.schemas,
            result: {
                resultType: 'dynamicSchemaResult',
                definitionResult,
                definitionSchema
            }
        };
    }

    /**
     * DynamicSchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {definitionResult, definitionSchema} = denormalizeState.result;
        return definitionSchema.denormalize(definitionResult, path);
    }
}

export default function DynamicSchemaFactory(...args: any[]): DynamicSchema {
    return new DynamicSchema(...args);
}

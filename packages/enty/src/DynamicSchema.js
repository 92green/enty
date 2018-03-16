// @flow
import Child from './abstract/Child';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {Schema} from './util/definitions';
// import type {Structure} from './util/definitions';

/**
 * @module Schema
 */

/**
 * DynamicSchema
 *
 * @memberof module:Schema
 */
export class DynamicSchema extends Child implements Schema<*> {
    options: Object;
    constructor(definition: Function, options: Object = {}) {
        super(definition);
        this.options = {
            definition,
            ...options
        };
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

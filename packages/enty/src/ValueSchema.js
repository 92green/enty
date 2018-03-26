// @flow
import Child from './abstract/Child';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {Schema} from './util/definitions';
import type {Entity} from './util/definitions';

/**
 * ValueSchema
 */
export class ValueSchema extends Child implements Schema<Entity> {
    options: Entity;

    constructor(definition: Schema<Entity>, options: Object = {}) {
        super(definition);
        this.options = {
            constructor: item => ({id: item}),
            ...options
        };
    }

    /**
     * ValueSchema.normalize
     */
    normalize(data: *, entities: Object = {}): NormalizeState {
        const {constructor} = this.options;
        const {result, schemas} = this.definition.normalize(constructor(data), entities);

        return {
            result,
            schemas,
            entities
        };
    }

    /**
     * ValueSchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        return this.definition.denormalize(denormalizeState, path);
    }
}

export default function ValueSchemaFactory(...args: any[]): ValueSchema {
    return new ValueSchema(...args);
}

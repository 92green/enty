// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntitySchemaInterface} from './util/definitions';
import type {Create} from './util/definitions';

/**
 * ValueSchema
 */
export default class ValueSchema {
    shape: EntitySchemaInterface;
    create: Create;

    constructor(
        shape: EntitySchemaInterface,
        options: {create?: Create} = {}
    ) {
        this.shape = shape;
        this.create = options.create || (id => ({id}));
    }

    normalize(data: *, entities: Object = {}): NormalizeState {
        const {result, schemas} = this.shape.normalize(this.create(data), entities);
        return {result, schemas, entities};
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        return this.shape.denormalize(denormalizeState, path);
    }
}


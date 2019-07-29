// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntitySchemaInterface} from './util/definitions';
import type {StructuralSchemaInterface} from './util/definitions';
import type {Create} from './util/definitions';
import type {Merge} from './util/definitions';

/**
 * ValueSchema
 */
export default class ValueSchema implements StructuralSchemaInterface {
    shape: EntitySchemaInterface;
    create: Create;
    merge: Merge;

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


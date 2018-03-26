// @flow
import type {Schema} from './util/definitions';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';

/**
 * The NullSchema isn't a useful type. It just declares the base functions
 * all schemas must have.
 */
export default class NullSchema implements Schema<*> {
    options: Object;
    definition: *;

    /**
     * NullSchema.normalize
     */
    normalize(data: *, entities: Object): NormalizeState  {
        return {
            entities,
            result: null,
            schemas: {}
        };
    }

    /**
     * NullSchema.denormalize
     */
    // eslint-disable-next-line
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): * {
        return null;
    }
}

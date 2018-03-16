// @flow
import type {Schema} from './util/definitions';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';

export default class NullSchema implements Schema<*> {
    options: Object;
    definition: *;
    normalize(data: *, entities: Object): NormalizeState  {
        return {
            entities,
            result: null,
            schemas: {}
        };
    }

    // eslint-disable-next-line
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): * {
        return null;
    }
}

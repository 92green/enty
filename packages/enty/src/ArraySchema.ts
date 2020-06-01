import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {Entities} from './util/definitions';
import {ShapeSchema} from './util/definitions';
import {Schema} from './util/definitions';

import REMOVED_ENTITY from './util/RemovedEntity';

export default class ArraySchema<A extends Schema> implements ShapeSchema<A> {
    shape: A;

    constructor(shape: A) {
        this.shape = shape;
    }

    merge(_: Array<unknown>, bb: Array<unknown>) {
        return bb;
    }

    create(aa: Array<unknown>): any {
        return aa;
    }

    normalize(data: any, entities: Entities = {}): NormalizeState {
        let schemas = {};
        const result = data.map((item: any): any => {
            const {result, schemas: childSchemas} = this.shape.normalize(item, entities);
            Object.assign(schemas, childSchemas);
            return result;
        });

        return {entities, schemas, result: this.create(result)};
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {result, entities} = denormalizeState;

        // Filter out any deleted keys
        if (result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item: A): any => {
                return this.shape.denormalize({result: item, entities}, path);
            })
            .filter((ii: unknown) => ii !== REMOVED_ENTITY);
    }
}

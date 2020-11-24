import {NormalizeParams, NormalizeReturn, DenormalizeParams} from './util/definitions';
import {Create} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';
import {Merge} from './util/definitions';
import {StructuralSchemaOptions} from './util/definitions';
import {Schema} from './util/definitions';

import REMOVED_ENTITY from './util/RemovedEntity';

export default class ArraySchema<Shape extends Schema> implements StructuralSchemaInterface<Shape> {
    shape: Shape;
    create: Create;
    merge: Merge;

    constructor(shape: Shape, options: StructuralSchemaOptions = {}) {
        this.shape = shape;
        this.merge = options.merge || ((_, bb) => bb);
        this.create = options.create || ((aa) => aa);
    }

    normalize({input, meta, state, changes}: NormalizeParams): NormalizeReturn {
        let schemasUsed = {};
        const output = input.map((item: any): any => {
            const {output, schemasUsed: childSchemas} = this.shape.normalize({
                changes,
                input: item,
                meta,
                state
            });
            Object.assign(schemasUsed, childSchemas);
            return output;
        });

        return {state, schemasUsed, changes, output: this.create(output)};
    }

    denormalize(params: DenormalizeParams): any {
        const {output, state, path} = params;
        if (output == null) return output;
        return output
            .map((item: any): any => this.shape.denormalize({output: item, state, path}))
            .filter((ii: any): any => ii !== REMOVED_ENTITY);
    }
}

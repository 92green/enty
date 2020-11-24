import {NormalizeParams, NormalizeReturn, DenormalizeParams} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';
import {Create} from './util/definitions';
import {Merge} from './util/definitions';
import {StructuralSchemaOptions} from './util/definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import del from 'unmutable/lib/delete';
import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';
import REMOVED_ENTITY from './util/RemovedEntity';

export default class ObjectSchema<A extends {}> implements StructuralSchemaInterface<A> {
    create: Create;
    merge: Merge;
    shape: A;

    constructor(shape: A, options: StructuralSchemaOptions = {}) {
        this.shape = shape;
        this.create = options.create || ((item) => ({...item}));
        this.merge = options.merge || ((previous, next) => ({...previous, ...next}));
    }

    /**
     * ObjectSchema.normalize
     */
    normalize(params: NormalizeParams): NormalizeReturn {
        const {shape} = this;
        const {input, state, changes, meta} = params;
        let schemasUsed = {};

        const output = Object.keys(shape).reduce((output: Object, key: any): any => {
            const value = get(key)(input);
            const schema = get(key)(shape);
            if (value) {
                const {output: childOutput, schemasUsed: childSchemas} = schema.normalize({
                    input: value,
                    changes,
                    state,
                    meta
                });
                Object.assign(schemasUsed, childSchemas);
                output = set(key, childOutput)(output);
            }

            return output;
        }, input);

        return {state, schemasUsed, changes, output: this.create(output)};
    }

    /**
     * ObjectSchema.denormalize
     */
    denormalize(params: DenormalizeParams): any {
        const {output, state, path = []} = params;
        const {shape} = this;

        if (output == null || output === REMOVED_ENTITY) {
            return output;
        }

        // Map denormalize to the values of output, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        return pipeWith(
            output,
            clone(),
            (item: Object): Object => {
                if (path.indexOf(this) !== -1) {
                    return item;
                }

                const keys = Object.keys(shape);

                for (let key of keys) {
                    const schema = get(key)(shape);
                    const output = get(key)(item);
                    const value = schema.denormalize({output, state, path: [...path, this]});

                    if (value !== REMOVED_ENTITY && value !== undefined) {
                        item = set(key, value)(item);
                    } else {
                        item = del(key)(item);
                    }
                }

                return item;
            }
        );
    }
}

import {NormalizeParams, NormalizeReturn, DenormalizeParams} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {EntitySchemaInterface} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';
import {IdAttribute} from './util/definitions';
import {Merge} from './util/definitions';

import {UndefinedIdError} from './util/Error';
import REMOVED_ENTITY from './util/RemovedEntity';
import ObjectSchema from './ObjectSchema';

export default class EntitySchema<A extends StructuralSchemaInterface<any>>
    implements EntitySchemaInterface<A> {
    name: string;
    shape: A;
    id: IdAttribute;
    merge: Merge | null | undefined;

    constructor(name: string, options: EntitySchemaOptions<any> = {}) {
        this.name = name;
        this.merge = options.merge;

        if (options.shape === null) {
            this.shape = null;
            this.id = options.id || ((data) => '' + data);
        } else {
            this.shape = options.shape || new ObjectSchema({});
            this.id = options.id || ((data) => data?.id);
        }
    }

    normalize({state, input, meta}: NormalizeParams): NormalizeReturn {
        const {shape, name} = this;

        let id = this.id(input);
        let previousEntity: any;
        let schemasUsed = {};
        let output: any;

        if (id == null) throw UndefinedIdError(name, id);
        id = id.toString();

        state[name] = state[name] || {};
        state[name][id] = state[name][id] || [null, {}];

        // only normalize if we have a defined shape
        if (shape == null) {
            output = input;
        } else {
            let _ = shape.normalize({input, state, meta});
            output = _.output;
            schemasUsed = _.schemasUsed;
            previousEntity = state[name][id].entity;
        }

        // list this schema as one that has been used
        schemasUsed[name] = this;

        state[name][id][0] = previousEntity
            ? (this.merge || shape.merge)(previousEntity, output)
            : output;

        Object.assign(state[name][id][1], meta);

        return {
            state,
            schemasUsed,
            output: id
        };
    }

    denormalize(params: DenormalizeParams): any {
        const {output, state, path} = params;
        const {shape, name} = this;
        const [entity] = state?.[name]?.[output] || [null, {}];

        if (entity == null || entity === REMOVED_ENTITY || shape == null) {
            return entity;
        }

        return shape.denormalize({output: entity, state, path});
    }
}

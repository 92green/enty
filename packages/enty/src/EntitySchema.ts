import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {ShapeSchema} from './util/definitions';
import {Id} from './util/definitions';
import {Entities} from './util/definitions';

import {UndefinedIdError} from './util/Error';
import getIn from 'unmutable/lib/getIn';
import REMOVED_ENTITY from './util/RemovedEntity';
import ObjectSchema from './ObjectSchema';

export default class EntitySchema<A extends ShapeSchema<any>> {
    name: string;
    shape: A | ObjectSchema<any>;
    id: Id;

    constructor(options: EntitySchemaOptions<A>) {
        this.name = options.name;

        if (options.shape === null) {
            this.shape = null;
            this.id = options.id || ((data) => '' + data);
        } else {
            this.shape = options.shape || new ObjectSchema({});
            this.id = options.id || ((data) => data.id);
        }
    }

    normalize(data: unknown, entities: Entities = {}): NormalizeState {
        let id = this.id(data);
        let previousEntity: unknown;
        let schemas = {};
        let result: unknown;

        if (id == null) {
            throw UndefinedIdError(this.name, id);
        }
        id = id.toString();

        entities[this.name] = entities[this.name] || {};

        // only normalize if we have a defined shape
        if (this.shape == null) {
            result = data;
        } else {
            let _ = this.shape.normalize(data, entities);
            result = _.result;
            schemas = _.schemas;
            previousEntity = entities[this.name][id];
        }

        // list this schema as one that has been used
        schemas[this.name] = this;

        entities[this.name][id] = previousEntity
            ? this.shape.merge(previousEntity, result)
            : result;

        return {
            entities,
            schemas,
            result: id,
        };
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {result, entities} = denormalizeState;
        const {shape, name} = this;
        const entity = getIn([name, result])(entities);

        if (entity == null || entity === REMOVED_ENTITY || shape == null) {
            return entity;
        }

        return shape.denormalize({result: entity, entities}, path);
    }
}

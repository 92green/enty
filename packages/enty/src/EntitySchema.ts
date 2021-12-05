import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {EntitySchemaInterface} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';
import {IdAttribute} from './util/definitions';
import {Merge} from './util/definitions';
import {Entities} from './util/definitions';

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
            this.id = options.id || (data => '' + data);
        } else {
            this.shape = options.shape || new ObjectSchema({});
            this.id = options.id || ((data: any) => data?.id);
        }
    }

    normalize(data: unknown, entities: Entities = {}): NormalizeState {
        const {shape, name} = this;

        let id = this.id(data);
        let previousEntity;
        let schemas = {};
        let result;

        if (id == null) {
            throw UndefinedIdError(name, id);
        }
        id = id.toString();

        entities[name] = entities[name] || {};

        //entities[name][id] = data;
        //return {entities, result: data};

        // only normalize if we have a defined shape
        if (shape == null) {
            result = data;
        } else {
            let _ = shape.normalize(data, entities);
            result = _.result;
            schemas = _.schemas;
            previousEntity = entities[name][id];
        }
        //console.log('normalize', {id, result, previousEntity});

        // list this schema as one that has been used
        schemas[name] = this;

        if (previousEntity) {
            Object.assign(entities[name][id], (this.merge || shape.merge)(previousEntity, result));
        } else {
            entities[name][id] = result;
        }

        return {
            entities,
            schemas,
            name,
            id,
            result: entities[name][id]
        };
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {result, entities} = denormalizeState;
        const {shape, name} = this;
        const entity = entities?.[name]?.[result];

        if (entity == null || entity === REMOVED_ENTITY || shape == null) {
            return entity;
        }

        return shape.denormalize({result: entity, entities}, path);
    }
}

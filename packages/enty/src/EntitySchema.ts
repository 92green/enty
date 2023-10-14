import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {Structure} from './util/definitions';
import {Entities} from './util/definitions';

import {UndefinedIdError} from './util/Error';
import REMOVED_ENTITY from './util/RemovedEntity';

type Options<T> = {
    shape?: Structure<T>;
    id?: (entity: T) => string;
    merge?: (previous: T, next: T) => T;
};

export default class EntitySchema<T> {
    name: string;
    shape: Structure<T> | null;
    id: (value: T) => string;
    merge?: (previous: T, next: T) => T;

    constructor(name: string, options: Options<T> = {}) {
        this.name = name;
        this.merge = options.merge;
        this.shape = options.shape ?? null;
        this.id = options.id || ((data: any) => data?.id);
    }

    normalize(data: T, entities: Entities = {}): NormalizeState {
        const {shape, name} = this;

        let id = this.id(data);
        let previousEntity: T | null = null;
        let schemas: Record<string, any> = {};
        let result: T;

        if (id == null) throw UndefinedIdError(name, id);
        id = id.toString();

        entities[name] = entities[name] || {};

        // only recurse if we have a defined shape
        if (shape) {
            let _ = shape.normalize(data, entities);
            result = _.result;
            schemas = _.schemas;
            previousEntity = entities[name][id] as T;
        } else {
            result = data;
        }

        // list this schema as one that has been used
        schemas[name] = this;

        // Store the entity
        entities[name][id] =
            previousEntity && shape ? (this.merge || shape.merge)(previousEntity, result) : result;

        return {
            entities,
            schemas,
            result: id
        };
    }

    denormalize(
        denormalizeState: DenormalizeState,
        path: Array<any> = []
    ): T | typeof REMOVED_ENTITY | null {
        const {result, entities} = denormalizeState;
        const {shape, name} = this;
        const entity = entities[name]?.[result] as T | typeof REMOVED_ENTITY;

        if (entity == null || entity === REMOVED_ENTITY || shape === null) return entity ?? null;

        return shape.denormalize({result: entity, entities}, path);
    }
}

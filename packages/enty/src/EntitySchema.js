// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntitySchemaOptions} from './util/definitions';
import type {EntitySchemaInterface} from './util/definitions';
import type {StructuralSchemaInterface} from './util/definitions';
import type {IdAttribute} from './util/definitions';

import {UndefinedIdError} from './util/Error';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/lib/get';
import NullSchema from './NullSchema';
import {DELETED_ENTITY} from './util/SchemaConstant';




export default class EntitySchema implements EntitySchemaInterface {
    name: string;
    shape: StructuralSchemaInterface;
    idAttribute: IdAttribute;

    constructor(name: string, options: EntitySchemaOptions = {}) {
        this.name = name;
        this.shape = options.shape || new NullSchema(name);
        this.idAttribute = options.idAttribute || get('id');
    }

    normalize(data: *, entities: Object = {}): NormalizeState {
        const {shape, idAttribute, name} = this;


        // It is important to check that our data is not already in a normalized state
        // It is reasonable to assume that a number or string represents an id not an entity.
        // If the data is sometimes saying an entity is an object and sometimes a primitive
        // there are bigger problems with the data structure.
        if(typeof data === 'string' || typeof data === 'number') {
            return {
                entities,
                schemas: {},
                result: data.toString()
            };
        }

        let id = idAttribute(data);
        if(id == null) {
            throw UndefinedIdError(name, id);
        }
        id = id.toString();

        entities[name] = entities[name] || {};

        const previousEntity = entities[name][id];

        // recurse into the children
        let {schemas, result} = shape.normalize(data, entities);

        // list this schema as one that has been used
        schemas[name] = this;

        entities[name][id] = previousEntity
            ? shape.merge(previousEntity, result)
            : result
        ;

        return {
            entities,
            schemas,
            result: id
        };
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {result, entities} = denormalizeState;
        const {shape, name} = this;
        const entity = getIn([name, result])(entities);

        if(entity == null || entity === DELETED_ENTITY) {
            return entity;
        }

        return shape.denormalize({result: entity, entities}, path);
    }
}


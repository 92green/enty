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
import REMOVED_ENTITY from './util/RemovedEntity';
import constructSchemaFromLiteral from './util/constructSchemaFromLiteral';




export default class EntitySchema<A: StructuralSchemaInterface<any>> implements EntitySchemaInterface<A> {
    name: string;
    _shape: A;
    idAttribute: IdAttribute;

    constructor(name: string, options: EntitySchemaOptions<any> = {}) {
        this.name = name;
        this.shape = options.shape || new NullSchema(name);
        this.idAttribute = options.idAttribute || get('id');
    }

    get shape(): A {
        return this._shape;
    }
    set shape(shape: any) {
        this._shape = constructSchemaFromLiteral(shape);
    }

    normalize(data: mixed, entities: Object = {}): NormalizeState {
        const {shape, idAttribute, name} = this;


        // It is important to check that our data is not already in a normalized state
        // It is reasonable to assume that a number or string represents an id not an entity.
        // If the data is sometimes saying an entity is an object and sometimes a primitive
        // there are bigger problems with the data structure.
        // @todo I'm skeptical that this check even needs to happen
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

        if(entity == null || entity === REMOVED_ENTITY) {
            return entity;
        }

        return shape.denormalize({result: entity, entities}, path);
    }
}


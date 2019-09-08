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
import REMOVED_ENTITY from './util/RemovedEntity';
import ObjectSchema from './ObjectSchema';
import constructSchemaFromLiteral from './util/constructSchemaFromLiteral';




export default class EntitySchema<A: StructuralSchemaInterface<any>> implements EntitySchemaInterface<A> {
    name: string;
    _shape: A;
    idAttribute: IdAttribute;

    constructor(name: string, options: EntitySchemaOptions<any> = {}) {
        this.name = name;
        this.shape = (options.shape === undefined) ? new ObjectSchema({}) : options.shape;
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

        let id = idAttribute(data);
        let previousEntity;
        let schemas = {};
        let result;

        if(id == null) {
            throw UndefinedIdError(name, id);
        }
        id = id.toString();

        entities[name] = entities[name] || {};

        // only normalize if we have a defined shape
        if(shape == null) {
            result = data;
        } else {
            let _ = shape.normalize(data, entities);
            result = _.result;
            schemas = _.schemas;
            previousEntity = entities[name][id];
        }

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

        if(entity == null || entity === REMOVED_ENTITY || shape == null) {
            return entity;
        }

        return shape.denormalize({result: entity, entities}, path);
    }
}


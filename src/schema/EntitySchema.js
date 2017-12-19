// @flow
import {PerhapsEither} from 'fronads/lib/Either';
import {DELETED_ENTITY} from './SchemaConstant';
import {NoDefinitionError} from '../utils/Error';
import {UndefinedIdError} from '../utils/Error';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';
import type {NormalizeState} from '../definitions';
import type {DenormalizeState} from '../definitions';

/**
 * @module Schema
 */

/**

EntitySchema

@memberof module:Schema

*/
export class EntitySchema {
    name: string;
    type: string;
    options: Object;
    constructor(name: string, options: Object = {}) {
        this.name = name;
        this.type = 'entity';
        this.options = {
            idAttribute: item => item && get(item, 'id'),
            denormalizeFilter: item => item && !item.get('deleted'),
            definition: null,
            ...options
        };
    }

    /**
     * EntitySchema.define
     */
    define(definition: any): EntitySchema {
        this.options.definition = definition;
        return this;
    }

    /**
     * EntitySchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {options, name} = this;
        const {idAttribute, definition} = options;

        if(definition == null) {
            throw NoDefinitionError(name);
        }

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

        const id = PerhapsEither(idAttribute(data))
            .map(id => id.toString())
            .leftMap((value: *) => {
                throw UndefinedIdError(name, value);
            })
            .value();

        entities[name] = entities[name] || {};

        const previousEntity = entities[name][id];

        // recurse into the children
        let {schemas = {}, result} = definition.normalize(data, entities);

        // list this schema as one that has been used
        schemas[name] = this;

        if(previousEntity) {
            result = definition.options.merge(previousEntity, result);
        }

        entities[name][id] = definition.options.constructor(result);

        return {
            entities,
            schemas,
            result: id
        };
    }

    /**
     * EntitySchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {result, entities} = denormalizeState;
        const {name, options} = this;
        const {definition, denormalizeFilter} = options;
        const entity = getIn(entities, [name, result]);

        if(entity == null) {
            return entity;
        }

        if(!denormalizeFilter(entity)) {
            return DELETED_ENTITY;
        }

        return definition.denormalize({result: entity, entities}, path);
    }
}

export default function EntitySchemaFactory(...args: any[]): EntitySchema {
    return new EntitySchema(...args);
}

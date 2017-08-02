// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';
import ObjectSchema from './ObjectSchema';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';


/**
 * @module Schema
 */

/**
 * EntitySchema
 *
 * @memberof module:Schema
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
            constructor: item => Map(item),
            merge: (aa, bb) => aa.merge(bb),
            definition: ObjectSchema({}),
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
        const {idAttribute, definition, constructor, merge} = options;

        // It is important to check that our data is not already in a normalized state
        // It is reasonable to assume that a number or string represents an id not an entity.
        // If the data is sometimes saying an entity is an object and sometimes a primitive
        // there are bigger problems with the data structure.

        if(typeof data === 'string' || typeof data === 'number') {
            return {
                entities,
                result: data.toString()
            };
        }

        // if(!idAttribute(data)) {
        //     console.error('Could Not find id in ', name, data);
        // }

        const id = idAttribute(data).toString();

        entities[name] = entities[name] || {};

        const previousEntity = entities[name][id];
        let value = definition.normalize(data, entities).result;

        if(previousEntity) {
            value = merge(previousEntity, value);
        }

        entities[name][id] = constructor(value);

        return {
            entities, result: id
        };
    }

    /**
     * EntitySchema.denormalize
     */
    denormalize(normalizeState: NormalizeState, path: string[] = []): any {
        const {result, entities} = normalizeState;
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

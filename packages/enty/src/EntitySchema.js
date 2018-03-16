// @flow
import {PerhapsEither} from 'fronads/lib/Either';
import {NoDefinitionError} from './util/Error';
import {UndefinedIdError} from './util/Error';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';
import Child from './abstract/Child';
import NullSchema from './NullSchema';

import type {Schema} from './util/definitions';
import type {Entity} from './util/definitions';
import type {Structure} from './util/definitions';

import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntityInput} from './util/definitions';


export class EntitySchema extends Child implements Schema<Entity> {
    type: string;
    options: Entity;
    definition: Schema<Structure>;

    /**
    @param name - The name of the entity
    */
    constructor(
        name: string,
        {definition = new NullSchema(), ...options}: EntityInput = {}
    ) {
        super(definition);
        this.options = {
            name,
            idAttribute: item => item && get(item, 'id'),
            ...options
        };
        this.type = 'entity';
    }

    /**
     * EntitySchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const {idAttribute, name} = this.options;

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
        const {definition} = this;
        const {name} = this.options;
        const entity = getIn(entities, [name, result]);

        if(entity == null) {
            return entity;
        }

        return definition.denormalize({result: entity, entities}, path);
    }
}

export default function EntitySchemaFactory(...args: any[]): EntitySchema {
    return new EntitySchema(...args);
}

// @flow
import type {Schema} from './util/definitions';
import type {Entity} from './util/definitions';
import type {Structure} from './util/definitions';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntitySchemaOptions} from './util/definitions';

import {PerhapsEither} from 'fronads/lib/Either';
import {NoDefinitionError} from './util/Error';
import {UndefinedIdError} from './util/Error';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/lib/get';
import Child from './abstract/Child';
import NullSchema from './NullSchema';


/**
 *  Entity Schemas define
 *  @param name - A name for the type of entity
 */
export class EntitySchema extends Child implements Schema<Entity> {
    type: string;
    options: Entity;
    definition: Schema<Structure>;

    constructor(
        name: string,
        options?: EntitySchemaOptions = {definition: new NullSchema()}
    ) {
        const {definition, ...optionsRest} = options;
        super(definition);
        this.options = {
            name,
            idAttribute: item => item && get('id')(item),
            ...optionsRest
        };
        this.type = 'entity';
    }

    /**
     * EntitySchema.normalize
     */
    normalize(data: *, entities: Object = {}): NormalizeState {
        const {definition} = this;
        const {idAttribute, name} = this.options;

        // $FlowFixMe - flow cant tell that constructor exists
        if(definition == null || definition.constructor === NullSchema) {
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
        let {schemas, result} = definition.normalize(data, entities);

        // list this schema as one that has been used
        schemas[name] = this;

        result = definition.options.constructor(result);

        entities[name][id] = previousEntity
            ? definition.options.merge(previousEntity, result)
            : result
        ;

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
        const entity = getIn([name, result])(entities);

        if(entity == null) {
            return entity;
        }

        return definition.denormalize({result: entity, entities}, path);
    }
}

export default function EntitySchemaFactory(...args: any[]): EntitySchema {
    return new EntitySchema(...args);
}

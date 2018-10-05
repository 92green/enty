// @flow
import type {StructureInput} from 'enty';
import type {KeyedDefinition} from 'enty';

import {Map} from 'immutable';
import {ObjectSchema} from 'enty';

/**
 * The MapSchema is a structural schema used to define relationships in objects.
 *
 * @example
 * const user = entity('user');
 * user.set(MapSchema({
 *     friends: ListSchema(user)
 * }))
 *
 * @param {Object} definition - an object describing any entity relationships that should be traversed.
 * @param {Object} options
 *
 */
export class MapSchema extends ObjectSchema {
    constructor(definition: KeyedDefinition, options: StructureInput = {}) {
        super(definition, options);
        this.options = {
            constructor: item => Map(item),
            denormalizeFilter: item => item && !item.get('deleted'),
            merge: (previous, next) => previous.merge(next),
            ...options
        };
    }
}

export default function MapSchemaFactory(...args: any[]): MapSchema {
    return new MapSchema(...args);
}

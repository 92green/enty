//@flow
import {Iterable, Map} from 'immutable';
import ListSchema from 'enty/lib/ListSchema';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';

/**
 * @module Selectors
 */

/**
 * Given a requestKey it will return the denormalized state object.
 */
export function selectEntityByResult(state: Object, resultKey: string, options: Object = {}): * {
    const {schemaKey = 'ENTITY_RECEIVE'} = options;
    const {stateKey = 'entity'} = options;

    const entities = state[stateKey];
    const schema = getIn(entities, ['_baseSchema', schemaKey]);


    if(!schema) {
        return;
    }

    const result = resultKey
        ? getIn(entities, ['_result', resultKey], schema.options.constructor())
        : schema.options.constructor()
    ;

    var data = schema.denormalize({result, entities});


    if(Iterable.isIndexed(data)) {
        return data.toArray ? data.toArray() : data;
    }
    return data.toObject ? data.toObject() : data;
}

/**
 * Given a type and id of and entity in state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 */
export function selectEntityById(state: Object, type: string, id: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const entities = state[stateKey];
    const schema = getIn(entities, ['_schemas', type]);

    if(!schema) {
        return;
    }

    return schema.denormalize({result: id, entities});
}

/**
 * Access a whole entity type as a list
 */
export function selectEntityByType(state: Object, type: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const entities = state[stateKey];
    const schema = ListSchema(getIn(entities, ['_schemas', type]));

    const data = schema.denormalize({
        result: get(entities, type, Map())
            .keySeq()
            .toList(),
        entities
    });

    return data;
}


//@flow
// import {denormalize} from 'normalizr';
// import denormalize from './schema/Denormalize';
import {Iterable, Map} from 'immutable';
import ListSchema from 'enty/lib/ListSchema';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';

const defaultOptions = {
    schemaKey: 'ENTITY_RECEIVE',
    stateKey: 'entity'
};

/**
 * @module Selectors
 */

/**
 * The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.
 * @param  {object} state
 * @param  {string} resultKey
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {object} entity map
 */
export function selectEntityByResult(state: Object, resultKey: string, options: Object = {}): any {
    const {schemaKey, stateKey} = Object.assign({}, defaultOptions, options);
    const entities = state[stateKey];
    const schema = getIn(entities, ['_baseSchema', schemaKey]);

    if(!schema) {
        return;
    }

    var data = schema.denormalize({result: getIn(entities, ['_result', resultKey]), entities});

    if(data) {
        return Iterable.isIndexed(data) ? data.toArray() : data.toObject();
    }
}

/**
 * Given a type and id of and entity in state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 * @param  {object} state
 * @param  {string} type
 * @param  {string} id
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {object} entity map
 */
export function selectEntityById(state: Object, type: string, id: string, options: Object = {}): any {
    const {stateKey} = Object.assign({}, defaultOptions, options);
    const entities = state[stateKey];
    const schema = getIn(entities, ['_schemas', type]);

    if(!schema) {
        return;
    }

    return schema.denormalize({result: id, entities});
}

/**
 * Access a whole entity type as a list
 * @param  {object} state
 * @param  {string} type
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {Immutable.List} entity list
 */
export function selectEntityByType(state: Object, type: string, options: Object = {}): any {
    const {stateKey} = Object.assign({}, defaultOptions, options);
    const entities = state[stateKey];
    const schema = ListSchema(getIn(entities, ['_schemas', type]));

    if(!schema) {
        return;
    }

    const data = schema.denormalize({
        result: get(entities, type, Map())
            .keySeq()
            .toList(),
        entities
    });

    return data;
}


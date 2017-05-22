//@flow
import {denormalize} from 'normalizr';
import {Iterable, Map} from 'immutable';

/**
 * @module Selectors
 */

/**
 * The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.
 * @param  {object} state
 * @param  {string} resultKey
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {object} entity map
 * @memberof module:Selectors
 */
export function selectEntityByResult({entity}, resultKey, schemaKey = 'ENTITY_RECEIVE') {
    var data = denormalize(
        entity.getIn(['_result', resultKey]),
        entity.getIn(['_schema', schemaKey]),
        entity
    );

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
 * @memberof module:Selectors
 */
export function selectEntityById({entity}, type, id, schemaKey = 'ENTITY_RECEIVE') {
    var data = denormalize(
        entity.getIn([type, id]),
        entity.getIn(['_schema', schemaKey])[type],
        entity
    );

    return data;
}

/**
 * Access a whole entity type as a list
 * @param  {object} state
 * @param  {string} type
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {Immutable.List} entity list
 * @memberof module:Selectors
 */
export function selectEntityByType({entity}, type, schemaKey = 'ENTITY_RECEIVE') {
    const data = denormalize(
        entity
            .get(type, Map())
            .keySeq()
            .toList(),
        [entity.getIn(['_schema', schemaKey])[type]],
        entity,
    );

    return data;
}


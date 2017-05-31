//@flow
// import {denormalize} from 'normalizr';
// import denormalize from './schema/Denormalize';
import {Iterable, Map} from 'immutable';
import ArraySchema from './schema/ArraySchema';

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
    const schema = entity.getIn(['_schema', schemaKey]);

    if(!schema) {
        return;
    }

    var data = schema.denormalize(
        entity.getIn(['_result', resultKey]),
        schema,
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
    const schema = entity.getIn(['_schema', schemaKey]).itemSchema[type];

    if(!schema) {
        return;
    }

    return schema.denormalize(id, schema, entity);
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
    const schema = ArraySchema(entity.getIn(['_schema', schemaKey]).itemSchema[type]);

    if(!schema) {
        return;
    }

    const data = schema.denormalize(
        entity
            .get(type, Map())
            .keySeq()
            .toList(),
        schema,
        entity,
    );

    return data;
}


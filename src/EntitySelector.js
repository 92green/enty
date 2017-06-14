//@flow
// import {denormalize} from 'normalizr';
// import denormalize from './schema/Denormalize';
import {Iterable, Map} from 'immutable';
import ArraySchema from './schema/ArraySchema';

type SelectOptions = {
    schemaKey?: string,
    stateKey?: string
};

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
 * @memberof module:Selectors
 */
export function selectEntityByResult(state: Object, resultKey: string, options: SelectOptions = {}) {
    const {schemaKey, stateKey} = Object.assign({}, defaultOptions, options);
    const entity = state[stateKey];
    const schema = entity.getIn(['_schema', schemaKey]);

    if(!schema) {
        return;
    }

    var data = schema.denormalize(entity.getIn(['_result', resultKey]), entity);

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
export function selectEntityById(state: Object, type: string, id: string, options: SelectOptions = {}) {
    const {schemaKey, stateKey} = Object.assign({}, defaultOptions, options);
    const entity = state[stateKey];
    const schema = entity.getIn(['_schema', schemaKey]).childSchema[type];

    if(!schema) {
        return;
    }

    return schema.denormalize(id, entity);
}

/**
 * Access a whole entity type as a list
 * @param  {object} state
 * @param  {string} type
 * @param  {string} [schemaKey=ENTITY_RECEIVE]
 * @return {Immutable.List} entity list
 * @memberof module:Selectors
 */
export function selectEntityByType(state: Object, type: string, options: SelectOptions = {}) {
    const {schemaKey, stateKey} = Object.assign({}, defaultOptions, options);
    const entity = state[stateKey];
    const schema = ArraySchema(entity.getIn(['_schema', schemaKey]).childSchema[type]);

    if(!schema) {
        return;
    }

    const data = schema.denormalize(
        entity
            .get(type, Map())
            .keySeq()
            .toList(),
        entity
    );

    return data;
}


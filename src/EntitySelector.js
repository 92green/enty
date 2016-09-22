import {denormalize} from 'denormalizr';
import {Map, Iterable} from 'immutable';


/**
 * The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.
 * @param  {object} state
 * @param  {string} resultKey
 * @param  {string} [schemaKey=mainSchema]
 * @return {object} entity map
 */
export function selectEntity(state, resultKey, schemaKey = 'mainSchema') {
    var {entity} = state;
    var data = denormalize(
        entity.getIn(['_result', resultKey]),
        entity,
        entity.getIn(['_schema', schemaKey])
    );

    if(data) {
        return Iterable.isIndexed(data) ? data.toArray() : data.toObject();
    }
}

/**
 * Given a path to entity state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 * @param  {object} state
 * @param  {array} path
 * @param  {string} [schemaKey=mainSchema]
 * @return {object} entity map
 */
export function selectEntityByPath(state, path, schemaKey = 'mainSchema') {
    var {entity} = state;
    return denormalize(
        entity.getIn(path),
        entity,
        entity.getIn(['_schema', schemaKey, path[0]])
    );
}

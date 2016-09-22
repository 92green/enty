'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectEntity = selectEntity;
exports.selectEntityByPath = selectEntityByPath;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

/**
 * The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.
 * @param  {object} state
 * @param  {string} resultKey
 * @param  {string} [schemaKey=mainSchema]
 * @return {object} entity map
 */
function selectEntity(state, resultKey) {
    var schemaKey = arguments.length <= 2 || arguments[2] === undefined ? 'mainSchema' : arguments[2];
    var entity = state.entity;

    var data = (0, _denormalizr.denormalize)(entity.getIn(['_result', resultKey]), entity, entity.getIn(['_schema', schemaKey]));

    if (data) {
        return _immutable.Iterable.isIndexed(data) ? data.toArray() : data.toObject();
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
function selectEntityByPath(state, path) {
    var schemaKey = arguments.length <= 2 || arguments[2] === undefined ? 'mainSchema' : arguments[2];
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(path), entity, entity.getIn(['_schema', schemaKey, path[0]]));
}
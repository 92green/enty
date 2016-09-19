'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectEntity = selectEntity;
exports.selectEntityByPath = selectEntityByPath;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

function selectEntity(state, resultKey) {
    var schemaKey = arguments.length <= 2 || arguments[2] === undefined ? 'mainSchema' : arguments[2];
    var entity = state.entity;

    var data = (0, _denormalizr.denormalize)(entity.getIn(['_result', resultKey]), entity, entity.getIn(['_schema', schemaKey]));

    if (data) {
        return _immutable.Iterable.isIndexed(data) ? data.toArray() : data.toObject();
    }
}

function selectEntityByPath(state, path) {
    var schemaKey = arguments.length <= 2 || arguments[2] === undefined ? 'mainSchema' : arguments[2];
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(path), entity, entity.getIn(['_schema', schemaKey, path[0]]));
}
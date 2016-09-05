'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectEntity = selectEntity;
exports.selectEntityByPath = selectEntityByPath;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

function selectEntity(state, resultKey, schema) {
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(['_result', resultKey]), entity, schema || entity.getIn(['_schema', resultKey]));
}

function selectEntityByPath(state, path, schema) {
    var entity = state.entity;

    return (0, _denormalizr.denormalize)(entity.getIn(path), entity, schema || entity.getIn(['_schema', path[0]]));
}
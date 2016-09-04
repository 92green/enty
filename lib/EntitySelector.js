'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.selectEntity = selectEntity;
exports.selectEntityByResult = selectEntityByResult;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

function selectEntity(schema, state, path) {
    return (0, _denormalizr.denormalize)(state.entity.getIn(path), state.entity, schema[path[0]]);
}

function selectEntityByResult(schema, state, path) {
    return state.entity.getIn(['result'].concat(path[0]), (0, _immutable.Map)()).map(function (ii, schemaName) {
        return (0, _denormalizr.denormalize)(ii, state.entity, schema[schemaName]);
    }).getIn(path.slice(1), (0, _immutable.Map)()).toObject();
}
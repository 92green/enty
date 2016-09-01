'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntitySelect = EntitySelect;
exports.EntitySelectByResult = EntitySelectByResult;

var _denormalizr = require('denormalizr');

var _immutable = require('immutable');

function EntitySelect(schema, state, path) {
    return (0, _denormalizr.denormalize)(state.entity.getIn(path), state.entity, schema[path[0]]);
}

function EntitySelectByResult(schema, state, path) {
    return state.entity.getIn(['result'].concat(path[0]), (0, _immutable.Map)()).map(function (ii, schemaName) {
        return (0, _denormalizr.denormalize)(ii, state.entity, schema[schemaName]);
    }).getIn(path.slice(1), (0, _immutable.Map)()).toObject();
}
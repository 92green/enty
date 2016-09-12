'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createSchema = createSchema;

var _normalizr = require('normalizr');

function createSchema(key) {
    var id = arguments.length <= 1 || arguments[1] === undefined ? 'id' : arguments[1];
    var defaults = arguments[2];

    return new _normalizr.Schema(key, {
        idAttribute: id,
        defaults: defaults
    });
}
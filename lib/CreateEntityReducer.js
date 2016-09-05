'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEntityReducer = createEntityReducer;

var _immutable = require('immutable');

var _denormalizr = require('denormalizr');

var _normalizr = require('normalizr');

function defaultConstructor(key, value) {
    return value;
}

function determineReviverType(constructor, schemaKey) {
    return function (key, value) {
        // Check if the value is an array or object and convert to that for them.
        var isIndexed = _immutable.Iterable.isIndexed(value);
        var returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(key || schemaKey, returnValue);
    };
}

function createEntityReducer(schemaMap) {
    var constructor = arguments.length <= 1 || arguments[1] === undefined ? defaultConstructor : arguments[1];


    var initialState = (0, _immutable.fromJS)({
        _schema: schemaMap,
        _result: {}
    });

    // Return our constructed reducer
    return function EntityReducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
        var _ref = arguments[1];
        var type = _ref.type;
        var payload = _ref.payload;
        var _ref$meta = _ref.meta;
        var meta = _ref$meta === undefined ? {} : _ref$meta;

        var schema = meta.schema || schemaMap[type];

        if (schema && payload) {
            // revive data from raw payload
            var reducedData = (0, _immutable.fromJS)(payload, determineReviverType(constructor, schema._key)).toJS();
            // normalize using proved schema

            var _fromJS$toObject = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema)).toObject();

            var result = _fromJS$toObject.result;
            var entities = _fromJS$toObject.entities;


            var resultData = schema._key ? (0, _immutable.Map)().set(schema._key, result) : result;

            return state
            // set results
            .setIn(['_result', meta.resultKey || type], resultData)
            // merge entities
            .mergeDeep(entities);
        }

        return state;
    };
}
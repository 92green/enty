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

/**
 * Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
 *
 * ```js
 * import {createEntityReducer} from 'redux-blueflag';
 * import EntitySchema from 'myapp/EntitySchema';
 *
 * export default combineReducers({
 *     entity: createEntityReducer({
 *         GRAPHQL_RECEIVE: EntitySchema,
 *         MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSceham
 *     }),
 * });
 * ```
 * @exports createEntityReducer
 * @param {object} schemaMap - Map of schema action names.
 * @param {function} constructor - constructor function to edit payload data before it is normalized.
 */
function createEntityReducer(schemaMap) {
    var constructor = arguments.length <= 1 || arguments[1] === undefined ? defaultConstructor : arguments[1];


    var initialState = (0, _immutable.Map)({
        _schema: (0, _immutable.Map)(schemaMap),
        _result: (0, _immutable.Map)()
    });

    var defaultMeta = {
        resultResetOnFetch: true
    };

    // Return our constructed reducer
    return function EntityReducer() {
        var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
        var _ref = arguments[1];
        var type = _ref.type;
        var payload = _ref.payload;
        var meta = _ref.meta;

        var _Object$assign = Object.assign({}, defaultMeta, meta);

        var _Object$assign$schema = _Object$assign.schema;
        var schema = _Object$assign$schema === undefined ? schemaMap[type] : _Object$assign$schema;
        var _Object$assign$result = _Object$assign.resultKey;
        var resultKey = _Object$assign$result === undefined ? type : _Object$assign$result;
        var resultResetOnFetch = _Object$assign.resultResetOnFetch;

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch

        if (resultResetOnFetch && /_FETCH$/g.test(type)) {
            return state.deleteIn(['_result', resultKey]);
        }

        if (schema && payload) {
            // revive data from raw payload
            var reducedData = (0, _immutable.fromJS)(payload, determineReviverType(constructor, schema._key)).toJS();
            // normalize using proved schema

            var _fromJS$toObject = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema)).toObject();

            var result = _fromJS$toObject.result;
            var entities = _fromJS$toObject.entities;

            // var resultData = (schema._key) ? Map().set(schema._key, result) : result;

            var resultData = result;

            return state
            // set results
            .setIn(['_result', resultKey], resultData)
            // merge entities
            .mergeDeep(entities);
        }

        return state;
    };
}
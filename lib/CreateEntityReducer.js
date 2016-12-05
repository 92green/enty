'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEntityReducer = createEntityReducer;

var _immutable = require('immutable');

var _normalizr = require('normalizr');

var _DetermineReviverType = require('./utils/DetermineReviverType');

var _DetermineReviverType2 = _interopRequireDefault(_DetermineReviverType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function defaultConstructor(value, key) {
    return value;
}

/**
 * Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
 * Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called `mainSchema` returns a reducer that holds the main entity state.
 * ```js
 * import {createEntityReducer} from 'redux-blueflag';
 * import EntitySchema from 'myapp/EntitySchema';
 *
 * export default combineReducers({
 *     entity: createEntityReducer({
 *          schemaMap: {
 *              GRAPHQL_RECEIVE: EntitySchema,
 *              MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSchema
 *          },
 *          beforeNormalize: (value, key) => value,
 *          afterNormalize: (value, key) => value,
 *          debug: false
 *     })
 * });
 * ```
 * @exports createEntityReducer
 * @param {object} schemaMap - Map of schema action names.
 * @param {function} config.beforeNormalize - config.beforeNormalize function to edit payload data before it is normalized.
 * @param {function} config.afterNormalize - config.afterNormalize function to edit payload data after it is normalized.
 */
function createEntityReducer(config) {
    var schemaMap = config.schemaMap,
        _config$beforeNormali = config.beforeNormalize,
        beforeNormalize = _config$beforeNormali === undefined ? defaultConstructor : _config$beforeNormali,
        _config$afterNormaliz = config.afterNormalize,
        afterNormalize = _config$afterNormaliz === undefined ? defaultConstructor : _config$afterNormaliz,
        _config$debug = config.debug,
        debug = _config$debug === undefined ? false : _config$debug;

    // set up debug logging

    var debugLog = function debugLog() {};
    var debugLogIf = function debugLogIf() {};
    if (debug) {
        console.log('EntityReducer: debugging enabled');
        debugLog = console.log;
        debugLogIf = function debugLogIf(condition) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (condition) {
                var _console;

                (_console = console).log.apply(_console, args);
            }
        };
    }

    var initialState = (0, _immutable.Map)({
        _schema: (0, _immutable.Map)(schemaMap),
        _result: (0, _immutable.Map)(),
        _requestState: (0, _immutable.Map)()
    });

    var defaultMeta = {
        resultResetOnFetch: true
    };

    // Return our constructed reducer
    return function EntityReducer() {
        var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
        var _ref = arguments[1];
        var type = _ref.type,
            payload = _ref.payload,
            meta = _ref.meta;

        var _Object$assign = Object.assign({}, defaultMeta, meta),
            _Object$assign$schema = _Object$assign.schema,
            schema = _Object$assign$schema === undefined ? schemaMap[type] : _Object$assign$schema,
            _Object$assign$result = _Object$assign.resultKey,
            resultKey = _Object$assign$result === undefined ? type : _Object$assign$result,
            resultResetOnFetch = _Object$assign.resultResetOnFetch;

        debugLog('\n\nEntityReducer: attempting to reduce with type "' + type + '"');

        state = state.setIn(['_requestState', resultKey], (0, _immutable.Map)({
            fetch: /_FETCH$/g.test(type),
            error: /_ERROR$/g.test(type) ? payload : null
        }));

        debugLog('EntityReducer: setting _requestState for "' + resultKey + '"');

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if (resultResetOnFetch && /_FETCH$/g.test(type)) {
            debugLog('EntityReducer: type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key');
            return state.deleteIn(['_result', resultKey]);
        }

        if (/_RECEIVE$/g.test(type)) {
            debugLog('EntityReducer: type is *_RECEIVE, will attempt to receive data');

            if (schema && payload) {

                // revive data from raw payload
                debugLog('EntityReducer: reviving data from raw payload and normalizing using provided schema');
                var reducedData = (0, _immutable.fromJS)(payload, (0, _DetermineReviverType2.default)(beforeNormalize, schema._key)).toJS();

                // normalize using provided schema

                var _fromJS$updateIn$toOb = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema))
                // Map through entities and apply afterNormalize function
                .updateIn(['entities'], function (entities) {
                    return entities.map(function (entity, key) {
                        debugLog('EntityReducer: ' + entity.size + ' "' + key + '" ' + (entity.size == 1 ? 'entity' : 'entities') + ' normalized');
                        return entity.map(function (ii) {
                            return afterNormalize(ii, key);
                        });
                    });
                }).toObject(),
                    result = _fromJS$updateIn$toOb.result,
                    entities = _fromJS$updateIn$toOb.entities;

                debugLogIf(entities.size == 0, 'EntityReducer: 0 entities have been normalised with your current schema. This is the schema being used:', schema);
                debugLog('EntityReducer: merging any normalized entities and result into state');

                return state
                // set results
                .setIn(['_result', resultKey], result)
                // merge entities only three layers deep
                // + merges all entity types to state
                // + merged all entity items into each entity type
                // + merges the top-level items on each entity item
                // but will not merge any deeper contents of entities themselves
                .mergeWith(function (prevEntityType, nextEntityType) {
                    return prevEntityType.mergeWith(function (prevEntityItem, nextEntityItem) {
                        return prevEntityItem.merge(nextEntityItem);
                    }, nextEntityType);
                }, entities);
            }

            debugLogIf(!schema, 'EntityReducer: schema is not defined, no entity data has been changed');
            debugLogIf(!payload, 'EntityReducer: payload is not defined, no entity data has been changed');
        }

        debugLog('EntityReducer: type is not *_RECEIVE, no entity data has been changed');
        return state;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJ2YWx1ZSIsImtleSIsImNvbmZpZyIsInNjaGVtYU1hcCIsImJlZm9yZU5vcm1hbGl6ZSIsImFmdGVyTm9ybWFsaXplIiwiZGVidWciLCJkZWJ1Z0xvZyIsImRlYnVnTG9nSWYiLCJjb25zb2xlIiwibG9nIiwiY29uZGl0aW9uIiwiYXJncyIsImluaXRpYWxTdGF0ZSIsIl9zY2hlbWEiLCJfcmVzdWx0IiwiX3JlcXVlc3RTdGF0ZSIsImRlZmF1bHRNZXRhIiwicmVzdWx0UmVzZXRPbkZldGNoIiwiRW50aXR5UmVkdWNlciIsInN0YXRlIiwidHlwZSIsInBheWxvYWQiLCJtZXRhIiwiT2JqZWN0IiwiYXNzaWduIiwic2NoZW1hIiwicmVzdWx0S2V5Iiwic2V0SW4iLCJmZXRjaCIsInRlc3QiLCJlcnJvciIsImRlbGV0ZUluIiwicmVkdWNlZERhdGEiLCJfa2V5IiwidG9KUyIsInVwZGF0ZUluIiwiZW50aXRpZXMiLCJtYXAiLCJlbnRpdHkiLCJzaXplIiwiaWkiLCJ0b09iamVjdCIsInJlc3VsdCIsIm1lcmdlV2l0aCIsInByZXZFbnRpdHlUeXBlIiwibmV4dEVudGl0eVR5cGUiLCJwcmV2RW50aXR5SXRlbSIsIm5leHRFbnRpdHlJdGVtIiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBZ0NnQkEsbUIsR0FBQUEsbUI7O0FBaENoQjs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DQyxHQUFuQyxFQUF3QztBQUNwQyxXQUFPRCxLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCTyxTQUFTRixtQkFBVCxDQUE2QkksTUFBN0IsRUFBcUM7QUFBQSxRQUdwQ0MsU0FIb0MsR0FPcENELE1BUG9DLENBR3BDQyxTQUhvQztBQUFBLGdDQU9w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QUFqRjtBQUNBLCtCQUFPRCxPQUFPRCxHQUFQLENBQVc7QUFBQSxtQ0FBTWpDLGVBQWVvQyxFQUFmLEVBQW1CeEMsR0FBbkIsQ0FBTjtBQUFBLHlCQUFYLENBQVA7QUFDSCxxQkFITSxDQUFQO0FBSUgsaUJBUHNCLEVBUXRCeUMsUUFSc0IsRUFQVDtBQUFBLG9CQU9YQyxNQVBXLHlCQU9YQSxNQVBXO0FBQUEsb0JBT0hOLFFBUEcseUJBT0hBLFFBUEc7O0FBaUJsQjdCLDJCQUFXNkIsU0FBU0csSUFBVCxJQUFpQixDQUE1Qiw2R0FBMElkLE1BQTFJO0FBQ0FuQjs7QUFFQSx1QkFBT2E7QUFDSDtBQURHLGlCQUVGUSxLQUZFLENBRUksQ0FBQyxTQUFELEVBQVlELFNBQVosQ0FGSixFQUU0QmdCLE1BRjVCO0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBHLGlCQVFGQyxTQVJFLENBUVEsVUFBQ0MsY0FBRCxFQUFpQkMsY0FBakIsRUFBb0M7QUFDM0MsMkJBQU9ELGVBQ0ZELFNBREUsQ0FDUSxVQUFDRyxjQUFELEVBQWlCQyxjQUFqQixFQUFvQztBQUMzQywrQkFBT0QsZUFBZUUsS0FBZixDQUFxQkQsY0FBckIsQ0FBUDtBQUNILHFCQUhFLEVBR0FGLGNBSEEsQ0FBUDtBQUlILGlCQWJFLEVBYUFULFFBYkEsQ0FBUDtBQWNIOztBQUVEN0IsdUJBQVcsQ0FBQ2tCLE1BQVo7QUFDQWxCLHVCQUFXLENBQUNjLE9BQVo7QUFDSDs7QUFFRGY7QUFDQSxlQUFPYSxLQUFQO0FBQ0gsS0FuRUQ7QUFvRUgiLCJmaWxlIjoiQ3JlYXRlRW50aXR5UmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZnJvbUpTLCBNYXB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQge25vcm1hbGl6ZX0gZnJvbSAnbm9ybWFsaXpyJztcbmltcG9ydCBEZXRlcm1pbmVSZXZpdmVyVHlwZSBmcm9tICcuL3V0aWxzL0RldGVybWluZVJldml2ZXJUeXBlJztcblxuZnVuY3Rpb24gZGVmYXVsdENvbnN0cnVjdG9yKHZhbHVlLCBrZXkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlZHVjZXIgdGhhdCBub3JtYWxpemVzIGRhdGEgYmFzZWQgb24gdGhlIFtub3JtYWxpenJdIHNjaGVtYXMgcHJvdmlkZWQuIFdoZW4gYW4gYWN0aW9uIGlzIGZpcmVkLCBpZiB0aGUgdHlwZSBtYXRjaGVzIG9uZSBwcm92aWVkIGluIGBzY2hlbWFNYXBgIHRoZSBwYXlsb2FkIGlzIG5vcm1hbGl6ZWQgYmFzZWQgb2ZmIHRoZSBnaXZlbiBzY2hlbWEuXG4gKiBUYWtlcyBhIG1hcCBvZiBzY2hlbWFzIHdoZXJlIGVhY2gga2V5IGlzIGFuIGFjdGlvbiBuYW1lIGFuZCB2YWx1ZSBpcyBhIHNjaGVtYS4gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBrZXkgY2FsbGVkIGBtYWluU2NoZW1hYCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IGhvbGRzIHRoZSBtYWluIGVudGl0eSBzdGF0ZS5cbiAqIGBgYGpzXG4gKiBpbXBvcnQge2NyZWF0ZUVudGl0eVJlZHVjZXJ9IGZyb20gJ3JlZHV4LWJsdWVmbGFnJztcbiAqIGltcG9ydCBFbnRpdHlTY2hlbWEgZnJvbSAnbXlhcHAvRW50aXR5U2NoZW1hJztcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICogICAgIGVudGl0eTogY3JlYXRlRW50aXR5UmVkdWNlcih7XG4gKiAgICAgICAgICBzY2hlbWFNYXA6IHtcbiAqICAgICAgICAgICAgICBHUkFQSFFMX1JFQ0VJVkU6IEVudGl0eVNjaGVtYSxcbiAqICAgICAgICAgICAgICBNWV9DVVNUT01fQUNUSU9OX1JFQ0VJVkU6IEVudGl0eVNjaGVtYS5teUN1c3RvbUFjdGlvblNjaGVtYVxuICogICAgICAgICAgfSxcbiAqICAgICAgICAgIGJlZm9yZU5vcm1hbGl6ZTogKHZhbHVlLCBrZXkpID0+IHZhbHVlLFxuICogICAgICAgICAgYWZ0ZXJOb3JtYWxpemU6ICh2YWx1ZSwga2V5KSA9PiB2YWx1ZSxcbiAqICAgICAgICAgIGRlYnVnOiBmYWxzZVxuICogICAgIH0pXG4gKiB9KTtcbiAqIGBgYFxuICogQGV4cG9ydHMgY3JlYXRlRW50aXR5UmVkdWNlclxuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYU1hcCAtIE1hcCBvZiBzY2hlbWEgYWN0aW9uIG5hbWVzLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29uZmlnLmJlZm9yZU5vcm1hbGl6ZSAtIGNvbmZpZy5iZWZvcmVOb3JtYWxpemUgZnVuY3Rpb24gdG8gZWRpdCBwYXlsb2FkIGRhdGEgYmVmb3JlIGl0IGlzIG5vcm1hbGl6ZWQuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25maWcuYWZ0ZXJOb3JtYWxpemUgLSBjb25maWcuYWZ0ZXJOb3JtYWxpemUgZnVuY3Rpb24gdG8gZWRpdCBwYXlsb2FkIGRhdGEgYWZ0ZXIgaXQgaXMgbm9ybWFsaXplZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eVJlZHVjZXIoY29uZmlnKSB7XG5cbiAgICBjb25zdCB7XG4gICAgICAgIHNjaGVtYU1hcCxcbiAgICAgICAgYmVmb3JlTm9ybWFsaXplID0gZGVmYXVsdENvbnN0cnVjdG9yLFxuICAgICAgICBhZnRlck5vcm1hbGl6ZSA9IGRlZmF1bHRDb25zdHJ1Y3RvcixcbiAgICAgICAgZGVidWcgPSBmYWxzZVxuICAgIH0gPSBjb25maWc7XG5cbiAgICAvLyBzZXQgdXAgZGVidWcgbG9nZ2luZ1xuICAgIHZhciBkZWJ1Z0xvZyA9ICgpID0+IHt9O1xuICAgIHZhciBkZWJ1Z0xvZ0lmID0gKCkgPT4ge307XG4gICAgaWYoZGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEVudGl0eVJlZHVjZXI6IGRlYnVnZ2luZyBlbmFibGVkYCk7XG4gICAgICAgIGRlYnVnTG9nID0gY29uc29sZS5sb2c7XG4gICAgICAgIGRlYnVnTG9nSWYgPSAoY29uZGl0aW9uLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgICAgICBpZihjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyguLi5hcmdzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBNYXAoe1xuICAgICAgICBfc2NoZW1hOiBNYXAoc2NoZW1hTWFwKSxcbiAgICAgICAgX3Jlc3VsdDogTWFwKCksXG4gICAgICAgIF9yZXF1ZXN0U3RhdGU6IE1hcCgpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmYXVsdE1ldGEgPSB7XG4gICAgICAgIHJlc3VsdFJlc2V0T25GZXRjaDogdHJ1ZVxuICAgIH1cblxuICAgIC8vIFJldHVybiBvdXIgY29uc3RydWN0ZWQgcmVkdWNlclxuICAgIHJldHVybiBmdW5jdGlvbiBFbnRpdHlSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCB7dHlwZSwgcGF5bG9hZCwgbWV0YX0pIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgc2NoZW1hID0gc2NoZW1hTWFwW3R5cGVdLFxuICAgICAgICAgICAgcmVzdWx0S2V5ID0gdHlwZSxcbiAgICAgICAgICAgIHJlc3VsdFJlc2V0T25GZXRjaCxcbiAgICAgICAgfSA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRNZXRhLCBtZXRhKTtcblxuICAgICAgICBkZWJ1Z0xvZyhgXFxuXFxuRW50aXR5UmVkdWNlcjogYXR0ZW1wdGluZyB0byByZWR1Y2Ugd2l0aCB0eXBlIFwiJHt0eXBlfVwiYCk7XG5cbiAgICAgICAgc3RhdGUgPSBzdGF0ZS5zZXRJbihbJ19yZXF1ZXN0U3RhdGUnLCByZXN1bHRLZXldLCBNYXAoe1xuICAgICAgICAgICAgZmV0Y2ggOiAvX0ZFVENIJC9nLnRlc3QodHlwZSksXG4gICAgICAgICAgICBlcnJvciA6IC9fRVJST1IkL2cudGVzdCh0eXBlKSA/IHBheWxvYWQgOiBudWxsXG4gICAgICAgIH0pKTtcblxuICAgICAgICBkZWJ1Z0xvZyhgRW50aXR5UmVkdWNlcjogc2V0dGluZyBfcmVxdWVzdFN0YXRlIGZvciBcIiR7cmVzdWx0S2V5fVwiYCk7XG5cbiAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBhIEZFVENIIGFuZCB0aGUgdXNlciBoYXNuJ3QgbmVnYXRlZCB0aGUgcmVzdWx0UmVzZXRPbkZldGNoXG4gICAgICAgIGlmKHJlc3VsdFJlc2V0T25GZXRjaCAmJiAvX0ZFVENIJC9nLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgIGRlYnVnTG9nKGBFbnRpdHlSZWR1Y2VyOiB0eXBlIGlzICpfRkVUQ0ggYW5kIHJlc3VsdFJlc2V0T25GZXRjaCBpcyB0cnVlLCByZXR1cm5pbmcgc3RhdGUgd2l0aCBkZWxldGVkIF9yZXN1bHQga2V5YCk7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuZGVsZXRlSW4oWydfcmVzdWx0JywgcmVzdWx0S2V5XSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZigvX1JFQ0VJVkUkL2cudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgZGVidWdMb2coYEVudGl0eVJlZHVjZXI6IHR5cGUgaXMgKl9SRUNFSVZFLCB3aWxsIGF0dGVtcHQgdG8gcmVjZWl2ZSBkYXRhYCk7XG5cbiAgICAgICAgICAgIGlmKHNjaGVtYSAmJiBwYXlsb2FkKSB7XG5cbiAgICAgICAgICAgICAgICAvLyByZXZpdmUgZGF0YSBmcm9tIHJhdyBwYXlsb2FkXG4gICAgICAgICAgICAgICAgZGVidWdMb2coYEVudGl0eVJlZHVjZXI6IHJldml2aW5nIGRhdGEgZnJvbSByYXcgcGF5bG9hZCBhbmQgbm9ybWFsaXppbmcgdXNpbmcgcHJvdmlkZWQgc2NoZW1hYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVkdWNlZERhdGEgPSBmcm9tSlMocGF5bG9hZCwgRGV0ZXJtaW5lUmV2aXZlclR5cGUoYmVmb3JlTm9ybWFsaXplLCBzY2hlbWEuX2tleSkpLnRvSlMoKTtcblxuICAgICAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSB1c2luZyBwcm92aWRlZCBzY2hlbWFcbiAgICAgICAgICAgICAgICBjb25zdCB7cmVzdWx0LCBlbnRpdGllc30gPSBmcm9tSlMobm9ybWFsaXplKHJlZHVjZWREYXRhLCBzY2hlbWEpKVxuICAgICAgICAgICAgICAgICAgICAvLyBNYXAgdGhyb3VnaCBlbnRpdGllcyBhbmQgYXBwbHkgYWZ0ZXJOb3JtYWxpemUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgLnVwZGF0ZUluKFsnZW50aXRpZXMnXSwgZW50aXRpZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudGl0aWVzLm1hcCgoZW50aXR5LCBrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWJ1Z0xvZyhgRW50aXR5UmVkdWNlcjogJHtlbnRpdHkuc2l6ZX0gXCIke2tleX1cIiAke2VudGl0eS5zaXplID09IDEgPyAnZW50aXR5JyA6ICdlbnRpdGllcyd9IG5vcm1hbGl6ZWRgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW50aXR5Lm1hcChpaSA9PiBhZnRlck5vcm1hbGl6ZShpaSwga2V5KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudG9PYmplY3QoKTtcblxuICAgICAgICAgICAgICAgIGRlYnVnTG9nSWYoZW50aXRpZXMuc2l6ZSA9PSAwLCBgRW50aXR5UmVkdWNlcjogMCBlbnRpdGllcyBoYXZlIGJlZW4gbm9ybWFsaXNlZCB3aXRoIHlvdXIgY3VycmVudCBzY2hlbWEuIFRoaXMgaXMgdGhlIHNjaGVtYSBiZWluZyB1c2VkOmAsIHNjaGVtYSk7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coYEVudGl0eVJlZHVjZXI6IG1lcmdpbmcgYW55IG5vcm1hbGl6ZWQgZW50aXRpZXMgYW5kIHJlc3VsdCBpbnRvIHN0YXRlYCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGVcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgLnNldEluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0sIHJlc3VsdClcbiAgICAgICAgICAgICAgICAgICAgLy8gbWVyZ2UgZW50aXRpZXMgb25seSB0aHJlZSBsYXllcnMgZGVlcFxuICAgICAgICAgICAgICAgICAgICAvLyArIG1lcmdlcyBhbGwgZW50aXR5IHR5cGVzIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgICAgIC8vICsgbWVyZ2VkIGFsbCBlbnRpdHkgaXRlbXMgaW50byBlYWNoIGVudGl0eSB0eXBlXG4gICAgICAgICAgICAgICAgICAgIC8vICsgbWVyZ2VzIHRoZSB0b3AtbGV2ZWwgaXRlbXMgb24gZWFjaCBlbnRpdHkgaXRlbVxuICAgICAgICAgICAgICAgICAgICAvLyBidXQgd2lsbCBub3QgbWVyZ2UgYW55IGRlZXBlciBjb250ZW50cyBvZiBlbnRpdGllcyB0aGVtc2VsdmVzXG4gICAgICAgICAgICAgICAgICAgIC5tZXJnZVdpdGgoKHByZXZFbnRpdHlUeXBlLCBuZXh0RW50aXR5VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZFbnRpdHlUeXBlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1lcmdlV2l0aCgocHJldkVudGl0eUl0ZW0sIG5leHRFbnRpdHlJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2RW50aXR5SXRlbS5tZXJnZShuZXh0RW50aXR5SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgbmV4dEVudGl0eVR5cGUpO1xuICAgICAgICAgICAgICAgICAgICB9LCBlbnRpdGllcyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRlYnVnTG9nSWYoIXNjaGVtYSwgYEVudGl0eVJlZHVjZXI6IHNjaGVtYSBpcyBub3QgZGVmaW5lZCwgbm8gZW50aXR5IGRhdGEgaGFzIGJlZW4gY2hhbmdlZGApO1xuICAgICAgICAgICAgZGVidWdMb2dJZighcGF5bG9hZCwgYEVudGl0eVJlZHVjZXI6IHBheWxvYWQgaXMgbm90IGRlZmluZWQsIG5vIGVudGl0eSBkYXRhIGhhcyBiZWVuIGNoYW5nZWRgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnTG9nKGBFbnRpdHlSZWR1Y2VyOiB0eXBlIGlzIG5vdCAqX1JFQ0VJVkUsIG5vIGVudGl0eSBkYXRhIGhhcyBiZWVuIGNoYW5nZWRgKTtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbn1cbiJdfQ==
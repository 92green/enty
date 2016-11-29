'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEntityReducer = createEntityReducer;

var _immutable = require('immutable');

var _denormalizr = require('denormalizr');

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
        afterNormalize = _config$afterNormaliz === undefined ? defaultConstructor : _config$afterNormaliz;


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

        state = state.setIn(['_requestState', resultKey], (0, _immutable.Map)({
            fetch: /_FETCH$/g.test(type),
            error: /_ERROR$/g.test(type) ? payload : null
        }));

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if (resultResetOnFetch && /_FETCH$/g.test(type)) {
            return state.deleteIn(['_result', resultKey]);
        }

        if (schema && payload && /_RECEIVE$/g.test(type)) {
            // revive data from raw payload
            var reducedData = (0, _immutable.fromJS)(payload, (0, _DetermineReviverType2.default)(beforeNormalize, schema._key)).toJS();
            // normalize using proved schema

            var _fromJS$updateIn$toOb = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema))
            // Map through entities and apply afterNormalize function
            .updateIn(['entities'], function (entities) {
                return entities.map(function (entity, key) {
                    return entity.map(function (ii) {
                        return afterNormalize(ii, key);
                    });
                });
            }).toObject(),
                result = _fromJS$updateIn$toOb.result,
                entities = _fromJS$updateIn$toOb.entities;

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

        return state;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJ2YWx1ZSIsImtleSIsImNvbmZpZyIsInNjaGVtYU1hcCIsImJlZm9yZU5vcm1hbGl6ZSIsImFmdGVyTm9ybWFsaXplIiwiaW5pdGlhbFN0YXRlIiwiX3NjaGVtYSIsIl9yZXN1bHQiLCJfcmVxdWVzdFN0YXRlIiwiZGVmYXVsdE1ldGEiLCJyZXN1bHRSZXNldE9uRmV0Y2giLCJFbnRpdHlSZWR1Y2VyIiwic3RhdGUiLCJ0eXBlIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJzY2hlbWEiLCJyZXN1bHRLZXkiLCJzZXRJbiIsImZldGNoIiwidGVzdCIsImVycm9yIiwiZGVsZXRlSW4iLCJyZWR1Y2VkRGF0YSIsIl9rZXkiLCJ0b0pTIiwidXBkYXRlSW4iLCJlbnRpdGllcyIsIm1hcCIsImVudGl0eSIsImlpIiwidG9PYmplY3QiLCJyZXN1bHQiLCJtZXJnZVdpdGgiLCJwcmV2RW50aXR5VHlwZSIsIm5leHRFbnRpdHlUeXBlIiwicHJldkVudGl0eUl0ZW0iLCJuZXh0RW50aXR5SXRlbSIsIm1lcmdlIl0sIm1hcHBpbmdzIjoiOzs7OztRQWdDZ0JBLG1CLEdBQUFBLG1COztBQWhDaEI7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLFNBQVNDLGtCQUFULENBQTRCQyxLQUE1QixFQUFtQ0MsR0FBbkMsRUFBd0M7QUFDcEMsV0FBT0QsS0FBUDtBQUNIOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCTyxTQUFTRixtQkFBVCxDQUE2QkksTUFBN0IsRUFBcUM7QUFBQSxRQUdwQ0MsU0FIb0MsR0FNcENELE1BTm9DLENBR3BDQyxTQUhvQztBQUFBLGdDQU1wQ0QsTUFOb0MsQ0FJcENFLGVBSm9DO0FBQUEsUUFJcENBLGVBSm9DLHlDQUlsQkwsa0JBSmtCO0FBQUEsZ0NBTXBDRyxNQU5vQyxDQUtwQ0csY0FMb0M7QUFBQSxRQUtwQ0EsY0FMb0MseUNBS25CTixrQkFMbUI7OztBQVF4QyxRQUFNTyxlQUFlLG9CQUFJO0FBQ3JCQyxpQkFBUyxvQkFBSUosU0FBSixDQURZO0FBRXJCSyxpQkFBUyxxQkFGWTtBQUdyQkMsdUJBQWU7QUFITSxLQUFKLENBQXJCOztBQU1BLFFBQU1DLGNBQWM7QUFDaEJDLDRCQUFvQjtBQURKLEtBQXBCOztBQUlBO0FBQ0EsV0FBTyxTQUFTQyxhQUFULEdBQW9FO0FBQUEsWUFBN0NDLEtBQTZDLHVFQUFyQ1AsWUFBcUM7QUFBQTtBQUFBLFlBQXRCUSxJQUFzQixRQUF0QkEsSUFBc0I7QUFBQSxZQUFoQkMsT0FBZ0IsUUFBaEJBLE9BQWdCO0FBQUEsWUFBUEMsSUFBTyxRQUFQQSxJQUFPOztBQUFBLDZCQUtuRUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLFdBQWxCLEVBQStCTSxJQUEvQixDQUxtRTtBQUFBLG1EQUVuRUcsTUFGbUU7QUFBQSxZQUVuRUEsTUFGbUUseUNBRTFEaEIsVUFBVVcsSUFBVixDQUYwRDtBQUFBLG1EQUduRU0sU0FIbUU7QUFBQSxZQUduRUEsU0FIbUUseUNBR3ZETixJQUh1RDtBQUFBLFlBSW5FSCxrQkFKbUUsa0JBSW5FQSxrQkFKbUU7O0FBUXZFRSxnQkFBUUEsTUFBTVEsS0FBTixDQUFZLENBQUMsZUFBRCxFQUFrQkQsU0FBbEIsQ0FBWixFQUEwQyxvQkFBSTtBQUNsREUsbUJBQVEsV0FBV0MsSUFBWCxDQUFnQlQsSUFBaEIsQ0FEMEM7QUFFbERVLG1CQUFRLFdBQVdELElBQVgsQ0FBZ0JULElBQWhCLElBQXdCQyxPQUF4QixHQUFrQztBQUZRLFNBQUosQ0FBMUMsQ0FBUjs7QUFNQTtBQUNBLFlBQUdKLHNCQUFzQixXQUFXWSxJQUFYLENBQWdCVCxJQUFoQixDQUF6QixFQUFnRDtBQUM1QyxtQkFBT0QsTUFBTVksUUFBTixDQUFlLENBQUMsU0FBRCxFQUFZTCxTQUFaLENBQWYsQ0FBUDtBQUNIOztBQUVELFlBQUdELFVBQVVKLE9BQVYsSUFBcUIsYUFBYVEsSUFBYixDQUFrQlQsSUFBbEIsQ0FBeEIsRUFBaUQ7QUFDN0M7QUFDQSxnQkFBTVksY0FBYyx1QkFBT1gsT0FBUCxFQUFnQixvQ0FBcUJYLGVBQXJCLEVBQXNDZSxPQUFPUSxJQUE3QyxDQUFoQixFQUFvRUMsSUFBcEUsRUFBcEI7QUFDQTs7QUFINkMsd0NBSWxCLHVCQUFPLDBCQUFVRixXQUFWLEVBQXVCUCxNQUF2QixDQUFQO0FBQ3ZCO0FBRHVCLGFBRXRCVSxRQUZzQixDQUViLENBQUMsVUFBRCxDQUZhLEVBRUMsb0JBQVk7QUFDaEMsdUJBQU9DLFNBQVNDLEdBQVQsQ0FBYSxVQUFDQyxNQUFELEVBQVMvQixHQUFULEVBQWlCO0FBQ2pDLDJCQUFPK0IsT0FBT0QsR0FBUCxDQUFXO0FBQUEsK0JBQU0xQixlQUFlNEIsRUFBZixFQUFtQmhDLEdBQW5CLENBQU47QUFBQSxxQkFBWCxDQUFQO0FBQ0gsaUJBRk0sQ0FBUDtBQUdILGFBTnNCLEVBT3RCaUMsUUFQc0IsRUFKa0I7QUFBQSxnQkFJdENDLE1BSnNDLHlCQUl0Q0EsTUFKc0M7QUFBQSxnQkFJOUJMLFFBSjhCLHlCQUk5QkEsUUFKOEI7O0FBYTdDLG1CQUFPakI7QUFDSDtBQURHLGFBRUZRLEtBRkUsQ0FFSSxDQUFDLFNBQUQsRUFBWUQsU0FBWixDQUZKLEVBRTRCZSxNQUY1QjtBQUdIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFQRyxhQVFGQyxTQVJFLENBUVEsVUFBQ0MsY0FBRCxFQUFpQkMsY0FBakIsRUFBb0M7QUFDM0MsdUJBQU9ELGVBQ0ZELFNBREUsQ0FDUSxVQUFDRyxjQUFELEVBQWlCQyxjQUFqQixFQUFvQztBQUMzQywyQkFBT0QsZUFBZUUsS0FBZixDQUFxQkQsY0FBckIsQ0FBUDtBQUNILGlCQUhFLEVBR0FGLGNBSEEsQ0FBUDtBQUlILGFBYkUsRUFhQVIsUUFiQSxDQUFQO0FBZUg7O0FBRUQsZUFBT2pCLEtBQVA7QUFDSCxLQWxERDtBQW1ESCIsImZpbGUiOiJDcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmcm9tSlMsIE1hcCwgSXRlcmFibGV9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQge2Rlbm9ybWFsaXplfSBmcm9tICdkZW5vcm1hbGl6cic7XG5pbXBvcnQge25vcm1hbGl6ZX0gZnJvbSAnbm9ybWFsaXpyJztcbmltcG9ydCBEZXRlcm1pbmVSZXZpdmVyVHlwZSBmcm9tICcuL3V0aWxzL0RldGVybWluZVJldml2ZXJUeXBlJztcblxuZnVuY3Rpb24gZGVmYXVsdENvbnN0cnVjdG9yKHZhbHVlLCBrZXkpIHtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlZHVjZXIgdGhhdCBub3JtYWxpemVzIGRhdGEgYmFzZWQgb24gdGhlIFtub3JtYWxpenJdIHNjaGVtYXMgcHJvdmlkZWQuIFdoZW4gYW4gYWN0aW9uIGlzIGZpcmVkLCBpZiB0aGUgdHlwZSBtYXRjaGVzIG9uZSBwcm92aWVkIGluIGBzY2hlbWFNYXBgIHRoZSBwYXlsb2FkIGlzIG5vcm1hbGl6ZWQgYmFzZWQgb2ZmIHRoZSBnaXZlbiBzY2hlbWEuXG4gKiBUYWtlcyBhIG1hcCBvZiBzY2hlbWFzIHdoZXJlIGVhY2gga2V5IGlzIGFuIGFjdGlvbiBuYW1lIGFuZCB2YWx1ZSBpcyBhIHNjaGVtYS4gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBrZXkgY2FsbGVkIGBtYWluU2NoZW1hYCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IGhvbGRzIHRoZSBtYWluIGVudGl0eSBzdGF0ZS5cbiAqIGBgYGpzXG4gKiBpbXBvcnQge2NyZWF0ZUVudGl0eVJlZHVjZXJ9IGZyb20gJ3JlZHV4LWJsdWVmbGFnJztcbiAqIGltcG9ydCBFbnRpdHlTY2hlbWEgZnJvbSAnbXlhcHAvRW50aXR5U2NoZW1hJztcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICogICAgIGVudGl0eTogY3JlYXRlRW50aXR5UmVkdWNlcih7XG4gKiAgICAgICAgICBzY2hlbWFNYXA6IHtcbiAqICAgICAgICAgICAgICBHUkFQSFFMX1JFQ0VJVkU6IEVudGl0eVNjaGVtYSxcbiAqICAgICAgICAgICAgICBNWV9DVVNUT01fQUNUSU9OX1JFQ0VJVkU6IEVudGl0eVNjaGVtYS5teUN1c3RvbUFjdGlvblNjaGVtYVxuICogICAgICAgICAgfSxcbiAqICAgICAgICAgIGJlZm9yZU5vcm1hbGl6ZTogKHZhbHVlLCBrZXkpID0+IHZhbHVlLFxuICogICAgICAgICAgYWZ0ZXJOb3JtYWxpemU6ICh2YWx1ZSwga2V5KSA9PiB2YWx1ZSxcbiAqICAgICB9KVxuICogfSk7XG4gKiBgYGBcbiAqIEBleHBvcnRzIGNyZWF0ZUVudGl0eVJlZHVjZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFNYXAgLSBNYXAgb2Ygc2NoZW1hIGFjdGlvbiBuYW1lcy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbmZpZy5iZWZvcmVOb3JtYWxpemUgLSBjb25maWcuYmVmb3JlTm9ybWFsaXplIGZ1bmN0aW9uIHRvIGVkaXQgcGF5bG9hZCBkYXRhIGJlZm9yZSBpdCBpcyBub3JtYWxpemVkLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29uZmlnLmFmdGVyTm9ybWFsaXplIC0gY29uZmlnLmFmdGVyTm9ybWFsaXplIGZ1bmN0aW9uIHRvIGVkaXQgcGF5bG9hZCBkYXRhIGFmdGVyIGl0IGlzIG5vcm1hbGl6ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSZWR1Y2VyKGNvbmZpZykge1xuXG4gICAgY29uc3Qge1xuICAgICAgICBzY2hlbWFNYXAsXG4gICAgICAgIGJlZm9yZU5vcm1hbGl6ZSA9IGRlZmF1bHRDb25zdHJ1Y3RvcixcbiAgICAgICAgYWZ0ZXJOb3JtYWxpemUgPSBkZWZhdWx0Q29uc3RydWN0b3JcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gTWFwKHtcbiAgICAgICAgX3NjaGVtYTogTWFwKHNjaGVtYU1hcCksXG4gICAgICAgIF9yZXN1bHQ6IE1hcCgpLFxuICAgICAgICBfcmVxdWVzdFN0YXRlOiBNYXAoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmF1bHRNZXRhID0ge1xuICAgICAgICByZXN1bHRSZXNldE9uRmV0Y2g6IHRydWVcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gb3VyIGNvbnN0cnVjdGVkIHJlZHVjZXJcbiAgICByZXR1cm4gZnVuY3Rpb24gRW50aXR5UmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwge3R5cGUsIHBheWxvYWQsIG1ldGF9KSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIHNjaGVtYSA9IHNjaGVtYU1hcFt0eXBlXSxcbiAgICAgICAgICAgIHJlc3VsdEtleSA9IHR5cGUsXG4gICAgICAgICAgICByZXN1bHRSZXNldE9uRmV0Y2gsXG4gICAgICAgIH0gPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TWV0YSwgbWV0YSk7XG5cblxuICAgICAgICBzdGF0ZSA9IHN0YXRlLnNldEluKFsnX3JlcXVlc3RTdGF0ZScsIHJlc3VsdEtleV0sIE1hcCh7XG4gICAgICAgICAgICBmZXRjaCA6IC9fRkVUQ0gkL2cudGVzdCh0eXBlKSxcbiAgICAgICAgICAgIGVycm9yIDogL19FUlJPUiQvZy50ZXN0KHR5cGUpID8gcGF5bG9hZCA6IG51bGxcbiAgICAgICAgfSkpO1xuXG5cbiAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBhIEZFVENIIGFuZCB0aGUgdXNlciBoYXNuJ3QgbmVnYXRlZCB0aGUgcmVzdWx0UmVzZXRPbkZldGNoXG4gICAgICAgIGlmKHJlc3VsdFJlc2V0T25GZXRjaCAmJiAvX0ZFVENIJC9nLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5kZWxldGVJbihbJ19yZXN1bHQnLCByZXN1bHRLZXldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHNjaGVtYSAmJiBwYXlsb2FkICYmIC9fUkVDRUlWRSQvZy50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAvLyByZXZpdmUgZGF0YSBmcm9tIHJhdyBwYXlsb2FkXG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkRGF0YSA9IGZyb21KUyhwYXlsb2FkLCBEZXRlcm1pbmVSZXZpdmVyVHlwZShiZWZvcmVOb3JtYWxpemUsIHNjaGVtYS5fa2V5KSkudG9KUygpO1xuICAgICAgICAgICAgLy8gbm9ybWFsaXplIHVzaW5nIHByb3ZlZCBzY2hlbWFcbiAgICAgICAgICAgIGNvbnN0IHtyZXN1bHQsIGVudGl0aWVzfSA9IGZyb21KUyhub3JtYWxpemUocmVkdWNlZERhdGEsIHNjaGVtYSkpXG4gICAgICAgICAgICAgICAgLy8gTWFwIHRocm91Z2ggZW50aXRpZXMgYW5kIGFwcGx5IGFmdGVyTm9ybWFsaXplIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgLnVwZGF0ZUluKFsnZW50aXRpZXMnXSwgZW50aXRpZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZW50aXRpZXMubWFwKChlbnRpdHksIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVudGl0eS5tYXAoaWkgPT4gYWZ0ZXJOb3JtYWxpemUoaWksIGtleSkpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRvT2JqZWN0KCk7XG5cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgICAgICAgICAgIC8vIHNldCByZXN1bHRzXG4gICAgICAgICAgICAgICAgLnNldEluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0sIHJlc3VsdClcbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBlbnRpdGllcyBvbmx5IHRocmVlIGxheWVycyBkZWVwXG4gICAgICAgICAgICAgICAgLy8gKyBtZXJnZXMgYWxsIGVudGl0eSB0eXBlcyB0byBzdGF0ZVxuICAgICAgICAgICAgICAgIC8vICsgbWVyZ2VkIGFsbCBlbnRpdHkgaXRlbXMgaW50byBlYWNoIGVudGl0eSB0eXBlXG4gICAgICAgICAgICAgICAgLy8gKyBtZXJnZXMgdGhlIHRvcC1sZXZlbCBpdGVtcyBvbiBlYWNoIGVudGl0eSBpdGVtXG4gICAgICAgICAgICAgICAgLy8gYnV0IHdpbGwgbm90IG1lcmdlIGFueSBkZWVwZXIgY29udGVudHMgb2YgZW50aXRpZXMgdGhlbXNlbHZlc1xuICAgICAgICAgICAgICAgIC5tZXJnZVdpdGgoKHByZXZFbnRpdHlUeXBlLCBuZXh0RW50aXR5VHlwZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldkVudGl0eVR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tZXJnZVdpdGgoKHByZXZFbnRpdHlJdGVtLCBuZXh0RW50aXR5SXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2RW50aXR5SXRlbS5tZXJnZShuZXh0RW50aXR5SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBuZXh0RW50aXR5VHlwZSk7XG4gICAgICAgICAgICAgICAgfSwgZW50aXRpZXMpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIl19
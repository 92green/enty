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

function defaultConstructor(key, value) {
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
    var constructor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultConstructor;


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
            var reducedData = (0, _immutable.fromJS)(payload, (0, _DetermineReviverType2.default)(constructor, schema._key)).toJS();
            // normalize using proved schema

            var _fromJS$toObject = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema)).toObject(),
                result = _fromJS$toObject.result,
                entities = _fromJS$toObject.entities;

            return state
            // set results
            .setIn(['_result', resultKey], result)
            // merge entities only two layers deep
            // merges all entity types to state, and merged all entities into each entity type
            // but will not merge the contents of entities themselves
            .mergeWith(function (prev, next) {
                return prev.merge(next);
            }, entities);
        }

        return state;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJrZXkiLCJ2YWx1ZSIsInNjaGVtYU1hcCIsImNvbnN0cnVjdG9yIiwiaW5pdGlhbFN0YXRlIiwiX3NjaGVtYSIsIl9yZXN1bHQiLCJfcmVxdWVzdFN0YXRlIiwiZGVmYXVsdE1ldGEiLCJyZXN1bHRSZXNldE9uRmV0Y2giLCJFbnRpdHlSZWR1Y2VyIiwic3RhdGUiLCJ0eXBlIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJzY2hlbWEiLCJyZXN1bHRLZXkiLCJzZXRJbiIsImZldGNoIiwidGVzdCIsImVycm9yIiwiZGVsZXRlSW4iLCJyZWR1Y2VkRGF0YSIsIl9rZXkiLCJ0b0pTIiwidG9PYmplY3QiLCJyZXN1bHQiLCJlbnRpdGllcyIsIm1lcmdlV2l0aCIsInByZXYiLCJuZXh0IiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMkJnQkEsbUIsR0FBQUEsbUI7O0FBM0JoQjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxLQUFqQyxFQUF3QztBQUNwQyxXQUFPQSxLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCTyxTQUFTSCxtQkFBVCxDQUE2QkksU0FBN0IsRUFBMEU7QUFBQSxRQUFsQ0MsV0FBa0MsdUVBQXBCSixrQkFBb0I7OztBQUU3RSxRQUFNSyxlQUFlLG9CQUFJO0FBQ3JCQyxpQkFBUyxvQkFBSUgsU0FBSixDQURZO0FBRXJCSSxpQkFBUyxxQkFGWTtBQUdyQkMsdUJBQWU7QUFITSxLQUFKLENBQXJCOztBQU1BLFFBQU1DLGNBQWM7QUFDaEJDLDRCQUFvQjtBQURKLEtBQXBCOztBQUlBO0FBQ0EsV0FBTyxTQUFTQyxhQUFULEdBQW9FO0FBQUEsWUFBN0NDLEtBQTZDLHVFQUFyQ1AsWUFBcUM7QUFBQTtBQUFBLFlBQXRCUSxJQUFzQixRQUF0QkEsSUFBc0I7QUFBQSxZQUFoQkMsT0FBZ0IsUUFBaEJBLE9BQWdCO0FBQUEsWUFBUEMsSUFBTyxRQUFQQSxJQUFPOztBQUFBLDZCQUtuRUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLFdBQWxCLEVBQStCTSxJQUEvQixDQUxtRTtBQUFBLG1EQUVuRUcsTUFGbUU7QUFBQSxZQUVuRUEsTUFGbUUseUNBRTFEZixVQUFVVSxJQUFWLENBRjBEO0FBQUEsbURBR25FTSxTQUhtRTtBQUFBLFlBR25FQSxTQUhtRSx5Q0FHdkROLElBSHVEO0FBQUEsWUFJbkVILGtCQUptRSxrQkFJbkVBLGtCQUptRTs7QUFRdkVFLGdCQUFRQSxNQUFNUSxLQUFOLENBQVksQ0FBQyxlQUFELEVBQWtCRCxTQUFsQixDQUFaLEVBQTBDLG9CQUFJO0FBQ2xERSxtQkFBUSxXQUFXQyxJQUFYLENBQWdCVCxJQUFoQixDQUQwQztBQUVsRFUsbUJBQVEsV0FBV0QsSUFBWCxDQUFnQlQsSUFBaEIsSUFBd0JDLE9BQXhCLEdBQWtDO0FBRlEsU0FBSixDQUExQyxDQUFSOztBQU1BO0FBQ0EsWUFBR0osc0JBQXNCLFdBQVdZLElBQVgsQ0FBZ0JULElBQWhCLENBQXpCLEVBQWdEO0FBQzVDLG1CQUFPRCxNQUFNWSxRQUFOLENBQWUsQ0FBQyxTQUFELEVBQVlMLFNBQVosQ0FBZixDQUFQO0FBQ0g7O0FBRUQsWUFBR0QsVUFBVUosT0FBVixJQUFxQixhQUFhUSxJQUFiLENBQWtCVCxJQUFsQixDQUF4QixFQUFpRDtBQUM3QztBQUNBLGdCQUFNWSxjQUFjLHVCQUFPWCxPQUFQLEVBQWdCLG9DQUFxQlYsV0FBckIsRUFBa0NjLE9BQU9RLElBQXpDLENBQWhCLEVBQWdFQyxJQUFoRSxFQUFwQjtBQUNBOztBQUg2QyxtQ0FJbEIsdUJBQU8sMEJBQVVGLFdBQVYsRUFBdUJQLE1BQXZCLENBQVAsRUFBdUNVLFFBQXZDLEVBSmtCO0FBQUEsZ0JBSXRDQyxNQUpzQyxvQkFJdENBLE1BSnNDO0FBQUEsZ0JBSTlCQyxRQUo4QixvQkFJOUJBLFFBSjhCOztBQU03QyxtQkFBT2xCO0FBQ0g7QUFERyxhQUVGUSxLQUZFLENBRUksQ0FBQyxTQUFELEVBQVlELFNBQVosQ0FGSixFQUU0QlUsTUFGNUI7QUFHSDtBQUNBO0FBQ0E7QUFMRyxhQU1GRSxTQU5FLENBTVEsVUFBQ0MsSUFBRCxFQUFPQyxJQUFQO0FBQUEsdUJBQWdCRCxLQUFLRSxLQUFMLENBQVdELElBQVgsQ0FBaEI7QUFBQSxhQU5SLEVBTTBDSCxRQU4xQyxDQUFQO0FBUUg7O0FBRUQsZUFBT2xCLEtBQVA7QUFDSCxLQXBDRDtBQXFDSCIsImZpbGUiOiJDcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtmcm9tSlMsIE1hcCwgSXRlcmFibGV9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQge2Rlbm9ybWFsaXplfSBmcm9tICdkZW5vcm1hbGl6cic7XG5pbXBvcnQge25vcm1hbGl6ZX0gZnJvbSAnbm9ybWFsaXpyJztcbmltcG9ydCBEZXRlcm1pbmVSZXZpdmVyVHlwZSBmcm9tICcuL3V0aWxzL0RldGVybWluZVJldml2ZXJUeXBlJztcblxuZnVuY3Rpb24gZGVmYXVsdENvbnN0cnVjdG9yKGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIHJlZHVjZXIgdGhhdCBub3JtYWxpemVzIGRhdGEgYmFzZWQgb24gdGhlIFtub3JtYWxpenJdIHNjaGVtYXMgcHJvdmlkZWQuIFdoZW4gYW4gYWN0aW9uIGlzIGZpcmVkLCBpZiB0aGUgdHlwZSBtYXRjaGVzIG9uZSBwcm92aWVkIGluIGBzY2hlbWFNYXBgIHRoZSBwYXlsb2FkIGlzIG5vcm1hbGl6ZWQgYmFzZWQgb2ZmIHRoZSBnaXZlbiBzY2hlbWEuXG4gKiBUYWtlcyBhIG1hcCBvZiBzY2hlbWFzIHdoZXJlIGVhY2gga2V5IGlzIGFuIGFjdGlvbiBuYW1lIGFuZCB2YWx1ZSBpcyBhIHNjaGVtYS4gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBrZXkgY2FsbGVkIGBtYWluU2NoZW1hYCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IGhvbGRzIHRoZSBtYWluIGVudGl0eSBzdGF0ZS5cbiAqIGBgYGpzXG4gKiBpbXBvcnQge2NyZWF0ZUVudGl0eVJlZHVjZXJ9IGZyb20gJ3JlZHV4LWJsdWVmbGFnJztcbiAqIGltcG9ydCBFbnRpdHlTY2hlbWEgZnJvbSAnbXlhcHAvRW50aXR5U2NoZW1hJztcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICogICAgIGVudGl0eTogY3JlYXRlRW50aXR5UmVkdWNlcih7XG4gKiAgICAgICAgIEdSQVBIUUxfUkVDRUlWRTogRW50aXR5U2NoZW1hLFxuICogICAgICAgICBNWV9DVVNUT01fQUNUSU9OX1JFQ0VJVkU6IEVudGl0eVNjaGVtYS5teUN1c3RvbUFjdGlvblNjZWhhbVxuICogICAgIH0pLFxuICogfSk7XG4gKiBgYGBcbiAqIEBleHBvcnRzIGNyZWF0ZUVudGl0eVJlZHVjZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFNYXAgLSBNYXAgb2Ygc2NoZW1hIGFjdGlvbiBuYW1lcy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yIC0gY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gZWRpdCBwYXlsb2FkIGRhdGEgYmVmb3JlIGl0IGlzIG5vcm1hbGl6ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSZWR1Y2VyKHNjaGVtYU1hcCwgY29uc3RydWN0b3IgPSBkZWZhdWx0Q29uc3RydWN0b3IpIHtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IE1hcCh7XG4gICAgICAgIF9zY2hlbWE6IE1hcChzY2hlbWFNYXApLFxuICAgICAgICBfcmVzdWx0OiBNYXAoKSxcbiAgICAgICAgX3JlcXVlc3RTdGF0ZTogTWFwKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZhdWx0TWV0YSA9IHtcbiAgICAgICAgcmVzdWx0UmVzZXRPbkZldGNoOiB0cnVlXG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIG91ciBjb25zdHJ1Y3RlZCByZWR1Y2VyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIEVudGl0eVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIHt0eXBlLCBwYXlsb2FkLCBtZXRhfSkge1xuICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICBzY2hlbWEgPSBzY2hlbWFNYXBbdHlwZV0sXG4gICAgICAgICAgICByZXN1bHRLZXkgPSB0eXBlLFxuICAgICAgICAgICAgcmVzdWx0UmVzZXRPbkZldGNoLFxuICAgICAgICB9ID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdE1ldGEsIG1ldGEpO1xuXG5cbiAgICAgICAgc3RhdGUgPSBzdGF0ZS5zZXRJbihbJ19yZXF1ZXN0U3RhdGUnLCByZXN1bHRLZXldLCBNYXAoe1xuICAgICAgICAgICAgZmV0Y2ggOiAvX0ZFVENIJC9nLnRlc3QodHlwZSksXG4gICAgICAgICAgICBlcnJvciA6IC9fRVJST1IkL2cudGVzdCh0eXBlKSA/IHBheWxvYWQgOiBudWxsXG4gICAgICAgIH0pKTtcblxuXG4gICAgICAgIC8vIElmIHRoZSBhY3Rpb24gaXMgYSBGRVRDSCBhbmQgdGhlIHVzZXIgaGFzbid0IG5lZ2F0ZWQgdGhlIHJlc3VsdFJlc2V0T25GZXRjaFxuICAgICAgICBpZihyZXN1bHRSZXNldE9uRmV0Y2ggJiYgL19GRVRDSCQvZy50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUuZGVsZXRlSW4oWydfcmVzdWx0JywgcmVzdWx0S2V5XSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihzY2hlbWEgJiYgcGF5bG9hZCAmJiAvX1JFQ0VJVkUkL2cudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgLy8gcmV2aXZlIGRhdGEgZnJvbSByYXcgcGF5bG9hZFxuICAgICAgICAgICAgY29uc3QgcmVkdWNlZERhdGEgPSBmcm9tSlMocGF5bG9hZCwgRGV0ZXJtaW5lUmV2aXZlclR5cGUoY29uc3RydWN0b3IsIHNjaGVtYS5fa2V5KSkudG9KUygpO1xuICAgICAgICAgICAgLy8gbm9ybWFsaXplIHVzaW5nIHByb3ZlZCBzY2hlbWFcbiAgICAgICAgICAgIGNvbnN0IHtyZXN1bHQsIGVudGl0aWVzfSA9IGZyb21KUyhub3JtYWxpemUocmVkdWNlZERhdGEsIHNjaGVtYSkpLnRvT2JqZWN0KCk7XG5cbiAgICAgICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgICAgICAgICAgIC8vIHNldCByZXN1bHRzXG4gICAgICAgICAgICAgICAgLnNldEluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0sIHJlc3VsdClcbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBlbnRpdGllcyBvbmx5IHR3byBsYXllcnMgZGVlcFxuICAgICAgICAgICAgICAgIC8vIG1lcmdlcyBhbGwgZW50aXR5IHR5cGVzIHRvIHN0YXRlLCBhbmQgbWVyZ2VkIGFsbCBlbnRpdGllcyBpbnRvIGVhY2ggZW50aXR5IHR5cGVcbiAgICAgICAgICAgICAgICAvLyBidXQgd2lsbCBub3QgbWVyZ2UgdGhlIGNvbnRlbnRzIG9mIGVudGl0aWVzIHRoZW1zZWx2ZXNcbiAgICAgICAgICAgICAgICAubWVyZ2VXaXRoKChwcmV2LCBuZXh0KSA9PiBwcmV2Lm1lcmdlKG5leHQpLCBlbnRpdGllcyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iXX0=
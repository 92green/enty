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
    var constructor = arguments.length <= 1 || arguments[1] === undefined ? defaultConstructor : arguments[1];


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJrZXkiLCJ2YWx1ZSIsImRldGVybWluZVJldml2ZXJUeXBlIiwiY29uc3RydWN0b3IiLCJzY2hlbWFLZXkiLCJpc0luZGV4ZWQiLCJyZXR1cm5WYWx1ZSIsInRvTGlzdCIsInRvTWFwIiwic2NoZW1hTWFwIiwiaW5pdGlhbFN0YXRlIiwiX3NjaGVtYSIsIl9yZXN1bHQiLCJfcmVxdWVzdFN0YXRlIiwiZGVmYXVsdE1ldGEiLCJyZXN1bHRSZXNldE9uRmV0Y2giLCJFbnRpdHlSZWR1Y2VyIiwic3RhdGUiLCJ0eXBlIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJzY2hlbWEiLCJyZXN1bHRLZXkiLCJzZXRJbiIsImZldGNoIiwidGVzdCIsImVycm9yIiwiZGVsZXRlSW4iLCJyZWR1Y2VkRGF0YSIsIl9rZXkiLCJ0b0pTIiwidG9PYmplY3QiLCJyZXN1bHQiLCJlbnRpdGllcyIsInJlc3VsdERhdGEiLCJtZXJnZURlZXAiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMENnQkEsbUIsR0FBQUEsbUI7O0FBMUNoQjs7QUFDQTs7QUFDQTs7QUFJQSxTQUFTQyxrQkFBVCxDQUE0QkMsR0FBNUIsRUFBaUNDLEtBQWpDLEVBQXdDO0FBQ3BDLFdBQU9BLEtBQVA7QUFDSDs7QUFFRCxTQUFTQyxvQkFBVCxDQUE4QkMsV0FBOUIsRUFBMkNDLFNBQTNDLEVBQXNEO0FBQ2xELFdBQU8sVUFBQ0osR0FBRCxFQUFNQyxLQUFOLEVBQWdCO0FBQ25CO0FBQ0EsWUFBSUksWUFBWSxvQkFBU0EsU0FBVCxDQUFtQkosS0FBbkIsQ0FBaEI7QUFDQSxZQUFJSyxjQUFjRCxZQUFZSixNQUFNTSxNQUFOLEVBQVosR0FBNkJOLE1BQU1PLEtBQU4sRUFBL0M7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBT0wsWUFBWUgsT0FBT0ksU0FBbkIsRUFBOEJFLFdBQTlCLENBQVA7QUFDSCxLQVREO0FBVUg7O0FBR0Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCTyxTQUFTUixtQkFBVCxDQUE2QlcsU0FBN0IsRUFBMEU7QUFBQSxRQUFsQ04sV0FBa0MseURBQXBCSixrQkFBb0I7OztBQUU3RSxRQUFNVyxlQUFlLG9CQUFJO0FBQ3JCQyxpQkFBUyxvQkFBSUYsU0FBSixDQURZO0FBRXJCRyxpQkFBUyxxQkFGWTtBQUdyQkMsdUJBQWU7QUFITSxLQUFKLENBQXJCOztBQU1BLFFBQU1DLGNBQWM7QUFDaEJDLDRCQUFvQjtBQURKLEtBQXBCOztBQUlBO0FBQ0EsV0FBTyxTQUFTQyxhQUFULEdBQW9FO0FBQUEsWUFBN0NDLEtBQTZDLHlEQUFyQ1AsWUFBcUM7QUFBQTtBQUFBLFlBQXRCUSxJQUFzQixRQUF0QkEsSUFBc0I7QUFBQSxZQUFoQkMsT0FBZ0IsUUFBaEJBLE9BQWdCO0FBQUEsWUFBUEMsSUFBTyxRQUFQQSxJQUFPOztBQUFBLDZCQUtuRUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLFdBQWxCLEVBQStCTSxJQUEvQixDQUxtRTs7QUFBQSxtREFFbkVHLE1BRm1FO0FBQUEsWUFFbkVBLE1BRm1FLHlDQUUxRGQsVUFBVVMsSUFBVixDQUYwRDtBQUFBLG1EQUduRU0sU0FIbUU7QUFBQSxZQUduRUEsU0FIbUUseUNBR3ZETixJQUh1RDtBQUFBLFlBSW5FSCxrQkFKbUUsa0JBSW5FQSxrQkFKbUU7OztBQVF2RUUsZ0JBQVFBLE1BQU1RLEtBQU4sQ0FBWSxDQUFDLGVBQUQsRUFBa0JELFNBQWxCLENBQVosRUFBMEMsb0JBQUk7QUFDbERFLG1CQUFRLFdBQVdDLElBQVgsQ0FBZ0JULElBQWhCLENBRDBDO0FBRWxEVSxtQkFBUSxXQUFXRCxJQUFYLENBQWdCVCxJQUFoQixJQUF3QkMsT0FBeEIsR0FBa0M7QUFGUSxTQUFKLENBQTFDLENBQVI7O0FBTUE7QUFDQSxZQUFHSixzQkFBc0IsV0FBV1ksSUFBWCxDQUFnQlQsSUFBaEIsQ0FBekIsRUFBZ0Q7QUFDNUMsbUJBQU9ELE1BQU1ZLFFBQU4sQ0FBZSxDQUFDLFNBQUQsRUFBWUwsU0FBWixDQUFmLENBQVA7QUFDSDs7QUFFRCxZQUFHRCxVQUFVSixPQUFWLElBQXFCLGFBQWFRLElBQWIsQ0FBa0JULElBQWxCLENBQXhCLEVBQWlEO0FBQzdDO0FBQ0EsZ0JBQUlZLGNBQWMsdUJBQU9YLE9BQVAsRUFBZ0JqQixxQkFBcUJDLFdBQXJCLEVBQWtDb0IsT0FBT1EsSUFBekMsQ0FBaEIsRUFBZ0VDLElBQWhFLEVBQWxCO0FBQ0E7O0FBSDZDLG1DQUlwQix1QkFBTywwQkFBVUYsV0FBVixFQUF1QlAsTUFBdkIsQ0FBUCxFQUF1Q1UsUUFBdkMsRUFKb0I7O0FBQUEsZ0JBSXhDQyxNQUp3QyxvQkFJeENBLE1BSndDO0FBQUEsZ0JBSWhDQyxRQUpnQyxvQkFJaENBLFFBSmdDOztBQU03Qzs7QUFDQSxnQkFBSUMsYUFBYUYsTUFBakI7O0FBRUEsbUJBQU9qQjtBQUNIO0FBREcsYUFFRlEsS0FGRSxDQUVJLENBQUMsU0FBRCxFQUFZRCxTQUFaLENBRkosRUFFNEJZLFVBRjVCO0FBR0g7QUFIRyxhQUlGQyxTQUpFLENBSVFGLFFBSlIsQ0FBUDtBQU1IOztBQUVELGVBQU9sQixLQUFQO0FBQ0gsS0FyQ0Q7QUFzQ0giLCJmaWxlIjoiQ3JlYXRlRW50aXR5UmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZnJvbUpTLCBNYXAsIEl0ZXJhYmxlfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHtkZW5vcm1hbGl6ZX0gZnJvbSAnZGVub3JtYWxpenInO1xuaW1wb3J0IHtub3JtYWxpemV9IGZyb20gJ25vcm1hbGl6cic7XG5cblxuXG5mdW5jdGlvbiBkZWZhdWx0Q29uc3RydWN0b3Ioa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZGV0ZXJtaW5lUmV2aXZlclR5cGUoY29uc3RydWN0b3IsIHNjaGVtYUtleSkge1xuICAgIHJldHVybiAoa2V5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYW4gYXJyYXkgb3Igb2JqZWN0IGFuZCBjb252ZXJ0IHRvIHRoYXQgZm9yIHRoZW0uXG4gICAgICAgIHZhciBpc0luZGV4ZWQgPSBJdGVyYWJsZS5pc0luZGV4ZWQodmFsdWUpO1xuICAgICAgICB2YXIgcmV0dXJuVmFsdWUgPSBpc0luZGV4ZWQgPyB2YWx1ZS50b0xpc3QoKSA6IHZhbHVlLnRvTWFwKCk7XG5cbiAgICAgICAgLy8gdGhlIGtleSBmcm9tIHRoZSBzY2hlbWEgaXMgdXNlZCBpZiBrZXkgaXMgdW5kZWZpbmVkXG4gICAgICAgIC8vIHRoaXMgaXMgb25seSB0aGUgY2FzZSBpZiB3ZSBhcmUgYXQgdGhlIHRvcCBsZXZlbCBvZiBvdXIgcGF5bG9hZFxuICAgICAgICAvLyB0aGF0IHdheSB0aGUgcmV2aXZlciBnZXRzIGtub3dsZWdlIG9mIHdoYXQgdHlwZSBvZiBzY2hlbWEgd2UgYXJlIHVzaW5nXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3RvcihrZXkgfHwgc2NoZW1hS2V5LCByZXR1cm5WYWx1ZSk7XG4gICAgfVxufVxuXG5cbi8qKlxuICogUmV0dXJucyBhIHJlZHVjZXIgdGhhdCBub3JtYWxpemVzIGRhdGEgYmFzZWQgb24gdGhlIFtub3JtYWxpenJdIHNjaGVtYXMgcHJvdmlkZWQuIFdoZW4gYW4gYWN0aW9uIGlzIGZpcmVkLCBpZiB0aGUgdHlwZSBtYXRjaGVzIG9uZSBwcm92aWVkIGluIGBzY2hlbWFNYXBgIHRoZSBwYXlsb2FkIGlzIG5vcm1hbGl6ZWQgYmFzZWQgb2ZmIHRoZSBnaXZlbiBzY2hlbWEuXG4gKiBUYWtlcyBhIG1hcCBvZiBzY2hlbWFzIHdoZXJlIGVhY2gga2V5IGlzIGFuIGFjdGlvbiBuYW1lIGFuZCB2YWx1ZSBpcyBhIHNjaGVtYS4gbXVzdCBoYXZlIGF0IGxlYXN0IG9uZSBrZXkgY2FsbGVkIGBtYWluU2NoZW1hYCByZXR1cm5zIGEgcmVkdWNlciB0aGF0IGhvbGRzIHRoZSBtYWluIGVudGl0eSBzdGF0ZS5cbiAqIGBgYGpzXG4gKiBpbXBvcnQge2NyZWF0ZUVudGl0eVJlZHVjZXJ9IGZyb20gJ3JlZHV4LWJsdWVmbGFnJztcbiAqIGltcG9ydCBFbnRpdHlTY2hlbWEgZnJvbSAnbXlhcHAvRW50aXR5U2NoZW1hJztcbiAqXG4gKiBleHBvcnQgZGVmYXVsdCBjb21iaW5lUmVkdWNlcnMoe1xuICogICAgIGVudGl0eTogY3JlYXRlRW50aXR5UmVkdWNlcih7XG4gKiAgICAgICAgIEdSQVBIUUxfUkVDRUlWRTogRW50aXR5U2NoZW1hLFxuICogICAgICAgICBNWV9DVVNUT01fQUNUSU9OX1JFQ0VJVkU6IEVudGl0eVNjaGVtYS5teUN1c3RvbUFjdGlvblNjZWhhbVxuICogICAgIH0pLFxuICogfSk7XG4gKiBgYGBcbiAqIEBleHBvcnRzIGNyZWF0ZUVudGl0eVJlZHVjZXJcbiAqIEBwYXJhbSB7b2JqZWN0fSBzY2hlbWFNYXAgLSBNYXAgb2Ygc2NoZW1hIGFjdGlvbiBuYW1lcy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNvbnN0cnVjdG9yIC0gY29uc3RydWN0b3IgZnVuY3Rpb24gdG8gZWRpdCBwYXlsb2FkIGRhdGEgYmVmb3JlIGl0IGlzIG5vcm1hbGl6ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbnRpdHlSZWR1Y2VyKHNjaGVtYU1hcCwgY29uc3RydWN0b3IgPSBkZWZhdWx0Q29uc3RydWN0b3IpIHtcblxuICAgIGNvbnN0IGluaXRpYWxTdGF0ZSA9IE1hcCh7XG4gICAgICAgIF9zY2hlbWE6IE1hcChzY2hlbWFNYXApLFxuICAgICAgICBfcmVzdWx0OiBNYXAoKSxcbiAgICAgICAgX3JlcXVlc3RTdGF0ZTogTWFwKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZWZhdWx0TWV0YSA9IHtcbiAgICAgICAgcmVzdWx0UmVzZXRPbkZldGNoOiB0cnVlXG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIG91ciBjb25zdHJ1Y3RlZCByZWR1Y2VyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIEVudGl0eVJlZHVjZXIoc3RhdGUgPSBpbml0aWFsU3RhdGUsIHt0eXBlLCBwYXlsb2FkLCBtZXRhfSkge1xuICAgICAgICB2YXIge1xuICAgICAgICAgICAgc2NoZW1hID0gc2NoZW1hTWFwW3R5cGVdLFxuICAgICAgICAgICAgcmVzdWx0S2V5ID0gdHlwZSxcbiAgICAgICAgICAgIHJlc3VsdFJlc2V0T25GZXRjaCxcbiAgICAgICAgfSA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRNZXRhLCBtZXRhKTtcblxuXG4gICAgICAgIHN0YXRlID0gc3RhdGUuc2V0SW4oWydfcmVxdWVzdFN0YXRlJywgcmVzdWx0S2V5XSwgTWFwKHtcbiAgICAgICAgICAgIGZldGNoIDogL19GRVRDSCQvZy50ZXN0KHR5cGUpLFxuICAgICAgICAgICAgZXJyb3IgOiAvX0VSUk9SJC9nLnRlc3QodHlwZSkgPyBwYXlsb2FkIDogbnVsbFxuICAgICAgICB9KSk7XG5cblxuICAgICAgICAvLyBJZiB0aGUgYWN0aW9uIGlzIGEgRkVUQ0ggYW5kIHRoZSB1c2VyIGhhc24ndCBuZWdhdGVkIHRoZSByZXN1bHRSZXNldE9uRmV0Y2hcbiAgICAgICAgaWYocmVzdWx0UmVzZXRPbkZldGNoICYmIC9fRkVUQ0gkL2cudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmRlbGV0ZUluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoc2NoZW1hICYmIHBheWxvYWQgJiYgL19SRUNFSVZFJC9nLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgIC8vIHJldml2ZSBkYXRhIGZyb20gcmF3IHBheWxvYWRcbiAgICAgICAgICAgIHZhciByZWR1Y2VkRGF0YSA9IGZyb21KUyhwYXlsb2FkLCBkZXRlcm1pbmVSZXZpdmVyVHlwZShjb25zdHJ1Y3Rvciwgc2NoZW1hLl9rZXkpKS50b0pTKCk7XG4gICAgICAgICAgICAvLyBub3JtYWxpemUgdXNpbmcgcHJvdmVkIHNjaGVtYVxuICAgICAgICAgICAgdmFyIHtyZXN1bHQsIGVudGl0aWVzfSA9IGZyb21KUyhub3JtYWxpemUocmVkdWNlZERhdGEsIHNjaGVtYSkpLnRvT2JqZWN0KCk7XG5cbiAgICAgICAgICAgIC8vIHZhciByZXN1bHREYXRhID0gKHNjaGVtYS5fa2V5KSA/IE1hcCgpLnNldChzY2hlbWEuX2tleSwgcmVzdWx0KSA6IHJlc3VsdDtcbiAgICAgICAgICAgIHZhciByZXN1bHREYXRhID0gcmVzdWx0O1xuXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcbiAgICAgICAgICAgICAgICAvLyBzZXQgcmVzdWx0c1xuICAgICAgICAgICAgICAgIC5zZXRJbihbJ19yZXN1bHQnLCByZXN1bHRLZXldLCByZXN1bHREYXRhKVxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGVudGl0aWVzXG4gICAgICAgICAgICAgICAgLm1lcmdlRGVlcChlbnRpdGllcyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iXX0=
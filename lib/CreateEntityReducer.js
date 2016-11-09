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
            var reducedData = (0, _immutable.fromJS)(payload, (0, _DetermineReviverType2.default)(constructor, schema._key)).toJS();
            // normalize using proved schema

            var _fromJS$toObject = (0, _immutable.fromJS)((0, _normalizr.normalize)(reducedData, schema)).toObject();

            var result = _fromJS$toObject.result;
            var entities = _fromJS$toObject.entities;


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJrZXkiLCJ2YWx1ZSIsInNjaGVtYU1hcCIsImNvbnN0cnVjdG9yIiwiaW5pdGlhbFN0YXRlIiwiX3NjaGVtYSIsIl9yZXN1bHQiLCJfcmVxdWVzdFN0YXRlIiwiZGVmYXVsdE1ldGEiLCJyZXN1bHRSZXNldE9uRmV0Y2giLCJFbnRpdHlSZWR1Y2VyIiwic3RhdGUiLCJ0eXBlIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJzY2hlbWEiLCJyZXN1bHRLZXkiLCJzZXRJbiIsImZldGNoIiwidGVzdCIsImVycm9yIiwiZGVsZXRlSW4iLCJyZWR1Y2VkRGF0YSIsIl9rZXkiLCJ0b0pTIiwidG9PYmplY3QiLCJyZXN1bHQiLCJlbnRpdGllcyIsIm1lcmdlV2l0aCIsInByZXYiLCJuZXh0IiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMkJnQkEsbUIsR0FBQUEsbUI7O0FBM0JoQjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxLQUFqQyxFQUF3QztBQUNwQyxXQUFPQSxLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCTyxTQUFTSCxtQkFBVCxDQUE2QkksU0FBN0IsRUFBMEU7QUFBQSxRQUFsQ0MsV0FBa0MsdUVBQXBCSixrQkFBb0I7OztBQUU3RSxRQUFNSyxlQUFlLG9CQUFJO0FBQ3JCQyxpQkFBUyxvQkFBSUgsU0FBSixDQURZO0FBRXJCSSxpQkFBUyxxQkFGWTtBQUdyQkMsdUJBQWU7QUFITSxLQUFKLENBQXJCOztBQU1BLFFBQU1DLGNBQWM7QUFDaEJDLDRCQUFvQjtBQURKLEtBQXBCOztBQUlBO0FBQ0EsV0FBTyxTQUFTQyxhQUFULEdBQW9FO0FBQUEsWUFBN0NDLEtBQTZDLHVFQUFyQ1AsWUFBcUM7QUFBQTtBQUFBLFlBQXRCUSxJQUFzQixRQUF0QkEsSUFBc0I7QUFBQSxZQUFoQkMsT0FBZ0IsUUFBaEJBLE9BQWdCO0FBQUEsWUFBUEMsSUFBTyxRQUFQQSxJQUFPOztBQUFBLDZCQUtuRUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLFdBQWxCLEVBQStCTSxJQUEvQixDQUxtRTs7QUFBQSxtREFFbkVHLE1BRm1FO0FBQUEsWUFFbkVBLE1BRm1FLHlDQUUxRGYsVUFBVVUsSUFBVixDQUYwRDtBQUFBLG1EQUduRU0sU0FIbUU7QUFBQSxZQUduRUEsU0FIbUUseUNBR3ZETixJQUh1RDtBQUFBLFlBSW5FSCxrQkFKbUUsa0JBSW5FQSxrQkFKbUU7OztBQVF2RUUsZ0JBQVFBLE1BQU1RLEtBQU4sQ0FBWSxDQUFDLGVBQUQsRUFBa0JELFNBQWxCLENBQVosRUFBMEMsb0JBQUk7QUFDbERFLG1CQUFRLFdBQVdDLElBQVgsQ0FBZ0JULElBQWhCLENBRDBDO0FBRWxEVSxtQkFBUSxXQUFXRCxJQUFYLENBQWdCVCxJQUFoQixJQUF3QkMsT0FBeEIsR0FBa0M7QUFGUSxTQUFKLENBQTFDLENBQVI7O0FBTUE7QUFDQSxZQUFHSixzQkFBc0IsV0FBV1ksSUFBWCxDQUFnQlQsSUFBaEIsQ0FBekIsRUFBZ0Q7QUFDNUMsbUJBQU9ELE1BQU1ZLFFBQU4sQ0FBZSxDQUFDLFNBQUQsRUFBWUwsU0FBWixDQUFmLENBQVA7QUFDSDs7QUFFRCxZQUFHRCxVQUFVSixPQUFWLElBQXFCLGFBQWFRLElBQWIsQ0FBa0JULElBQWxCLENBQXhCLEVBQWlEO0FBQzdDO0FBQ0EsZ0JBQU1ZLGNBQWMsdUJBQU9YLE9BQVAsRUFBZ0Isb0NBQXFCVixXQUFyQixFQUFrQ2MsT0FBT1EsSUFBekMsQ0FBaEIsRUFBZ0VDLElBQWhFLEVBQXBCO0FBQ0E7O0FBSDZDLG1DQUlsQix1QkFBTywwQkFBVUYsV0FBVixFQUF1QlAsTUFBdkIsQ0FBUCxFQUF1Q1UsUUFBdkMsRUFKa0I7O0FBQUEsZ0JBSXRDQyxNQUpzQyxvQkFJdENBLE1BSnNDO0FBQUEsZ0JBSTlCQyxRQUo4QixvQkFJOUJBLFFBSjhCOzs7QUFNN0MsbUJBQU9sQjtBQUNIO0FBREcsYUFFRlEsS0FGRSxDQUVJLENBQUMsU0FBRCxFQUFZRCxTQUFaLENBRkosRUFFNEJVLE1BRjVCO0FBR0g7QUFDQTtBQUNBO0FBTEcsYUFNRkUsU0FORSxDQU1RLFVBQUNDLElBQUQsRUFBT0MsSUFBUDtBQUFBLHVCQUFnQkQsS0FBS0UsS0FBTCxDQUFXRCxJQUFYLENBQWhCO0FBQUEsYUFOUixFQU0wQ0gsUUFOMUMsQ0FBUDtBQVFIOztBQUVELGVBQU9sQixLQUFQO0FBQ0gsS0FwQ0Q7QUFxQ0giLCJmaWxlIjoiQ3JlYXRlRW50aXR5UmVkdWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZnJvbUpTLCBNYXAsIEl0ZXJhYmxlfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHtkZW5vcm1hbGl6ZX0gZnJvbSAnZGVub3JtYWxpenInO1xuaW1wb3J0IHtub3JtYWxpemV9IGZyb20gJ25vcm1hbGl6cic7XG5pbXBvcnQgRGV0ZXJtaW5lUmV2aXZlclR5cGUgZnJvbSAnLi91dGlscy9EZXRlcm1pbmVSZXZpdmVyVHlwZSc7XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb25zdHJ1Y3RvcihrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSByZWR1Y2VyIHRoYXQgbm9ybWFsaXplcyBkYXRhIGJhc2VkIG9uIHRoZSBbbm9ybWFsaXpyXSBzY2hlbWFzIHByb3ZpZGVkLiBXaGVuIGFuIGFjdGlvbiBpcyBmaXJlZCwgaWYgdGhlIHR5cGUgbWF0Y2hlcyBvbmUgcHJvdmllZCBpbiBgc2NoZW1hTWFwYCB0aGUgcGF5bG9hZCBpcyBub3JtYWxpemVkIGJhc2VkIG9mZiB0aGUgZ2l2ZW4gc2NoZW1hLlxuICogVGFrZXMgYSBtYXAgb2Ygc2NoZW1hcyB3aGVyZSBlYWNoIGtleSBpcyBhbiBhY3Rpb24gbmFtZSBhbmQgdmFsdWUgaXMgYSBzY2hlbWEuIG11c3QgaGF2ZSBhdCBsZWFzdCBvbmUga2V5IGNhbGxlZCBgbWFpblNjaGVtYWAgcmV0dXJucyBhIHJlZHVjZXIgdGhhdCBob2xkcyB0aGUgbWFpbiBlbnRpdHkgc3RhdGUuXG4gKiBgYGBqc1xuICogaW1wb3J0IHtjcmVhdGVFbnRpdHlSZWR1Y2VyfSBmcm9tICdyZWR1eC1ibHVlZmxhZyc7XG4gKiBpbXBvcnQgRW50aXR5U2NoZW1hIGZyb20gJ215YXBwL0VudGl0eVNjaGVtYSc7XG4gKlxuICogZXhwb3J0IGRlZmF1bHQgY29tYmluZVJlZHVjZXJzKHtcbiAqICAgICBlbnRpdHk6IGNyZWF0ZUVudGl0eVJlZHVjZXIoe1xuICogICAgICAgICBHUkFQSFFMX1JFQ0VJVkU6IEVudGl0eVNjaGVtYSxcbiAqICAgICAgICAgTVlfQ1VTVE9NX0FDVElPTl9SRUNFSVZFOiBFbnRpdHlTY2hlbWEubXlDdXN0b21BY3Rpb25TY2VoYW1cbiAqICAgICB9KSxcbiAqIH0pO1xuICogYGBgXG4gKiBAZXhwb3J0cyBjcmVhdGVFbnRpdHlSZWR1Y2VyXG4gKiBAcGFyYW0ge29iamVjdH0gc2NoZW1hTWFwIC0gTWFwIG9mIHNjaGVtYSBhY3Rpb24gbmFtZXMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjb25zdHJ1Y3RvciAtIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGVkaXQgcGF5bG9hZCBkYXRhIGJlZm9yZSBpdCBpcyBub3JtYWxpemVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRW50aXR5UmVkdWNlcihzY2hlbWFNYXAsIGNvbnN0cnVjdG9yID0gZGVmYXVsdENvbnN0cnVjdG9yKSB7XG5cbiAgICBjb25zdCBpbml0aWFsU3RhdGUgPSBNYXAoe1xuICAgICAgICBfc2NoZW1hOiBNYXAoc2NoZW1hTWFwKSxcbiAgICAgICAgX3Jlc3VsdDogTWFwKCksXG4gICAgICAgIF9yZXF1ZXN0U3RhdGU6IE1hcCgpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVmYXVsdE1ldGEgPSB7XG4gICAgICAgIHJlc3VsdFJlc2V0T25GZXRjaDogdHJ1ZVxuICAgIH1cblxuICAgIC8vIFJldHVybiBvdXIgY29uc3RydWN0ZWQgcmVkdWNlclxuICAgIHJldHVybiBmdW5jdGlvbiBFbnRpdHlSZWR1Y2VyKHN0YXRlID0gaW5pdGlhbFN0YXRlLCB7dHlwZSwgcGF5bG9hZCwgbWV0YX0pIHtcbiAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgc2NoZW1hID0gc2NoZW1hTWFwW3R5cGVdLFxuICAgICAgICAgICAgcmVzdWx0S2V5ID0gdHlwZSxcbiAgICAgICAgICAgIHJlc3VsdFJlc2V0T25GZXRjaCxcbiAgICAgICAgfSA9IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRNZXRhLCBtZXRhKTtcblxuXG4gICAgICAgIHN0YXRlID0gc3RhdGUuc2V0SW4oWydfcmVxdWVzdFN0YXRlJywgcmVzdWx0S2V5XSwgTWFwKHtcbiAgICAgICAgICAgIGZldGNoIDogL19GRVRDSCQvZy50ZXN0KHR5cGUpLFxuICAgICAgICAgICAgZXJyb3IgOiAvX0VSUk9SJC9nLnRlc3QodHlwZSkgPyBwYXlsb2FkIDogbnVsbFxuICAgICAgICB9KSk7XG5cblxuICAgICAgICAvLyBJZiB0aGUgYWN0aW9uIGlzIGEgRkVUQ0ggYW5kIHRoZSB1c2VyIGhhc24ndCBuZWdhdGVkIHRoZSByZXN1bHRSZXNldE9uRmV0Y2hcbiAgICAgICAgaWYocmVzdWx0UmVzZXRPbkZldGNoICYmIC9fRkVUQ0gkL2cudGVzdCh0eXBlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLmRlbGV0ZUluKFsnX3Jlc3VsdCcsIHJlc3VsdEtleV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoc2NoZW1hICYmIHBheWxvYWQgJiYgL19SRUNFSVZFJC9nLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgIC8vIHJldml2ZSBkYXRhIGZyb20gcmF3IHBheWxvYWRcbiAgICAgICAgICAgIGNvbnN0IHJlZHVjZWREYXRhID0gZnJvbUpTKHBheWxvYWQsIERldGVybWluZVJldml2ZXJUeXBlKGNvbnN0cnVjdG9yLCBzY2hlbWEuX2tleSkpLnRvSlMoKTtcbiAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSB1c2luZyBwcm92ZWQgc2NoZW1hXG4gICAgICAgICAgICBjb25zdCB7cmVzdWx0LCBlbnRpdGllc30gPSBmcm9tSlMobm9ybWFsaXplKHJlZHVjZWREYXRhLCBzY2hlbWEpKS50b09iamVjdCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gc3RhdGVcbiAgICAgICAgICAgICAgICAvLyBzZXQgcmVzdWx0c1xuICAgICAgICAgICAgICAgIC5zZXRJbihbJ19yZXN1bHQnLCByZXN1bHRLZXldLCByZXN1bHQpXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2UgZW50aXRpZXMgb25seSB0d28gbGF5ZXJzIGRlZXBcbiAgICAgICAgICAgICAgICAvLyBtZXJnZXMgYWxsIGVudGl0eSB0eXBlcyB0byBzdGF0ZSwgYW5kIG1lcmdlZCBhbGwgZW50aXRpZXMgaW50byBlYWNoIGVudGl0eSB0eXBlXG4gICAgICAgICAgICAgICAgLy8gYnV0IHdpbGwgbm90IG1lcmdlIHRoZSBjb250ZW50cyBvZiBlbnRpdGllcyB0aGVtc2VsdmVzXG4gICAgICAgICAgICAgICAgLm1lcmdlV2l0aCgocHJldiwgbmV4dCkgPT4gcHJldi5tZXJnZShuZXh0KSwgZW50aXRpZXMpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxufVxuIl19
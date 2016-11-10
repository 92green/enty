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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNyZWF0ZUVudGl0eVJlZHVjZXIiLCJkZWZhdWx0Q29uc3RydWN0b3IiLCJrZXkiLCJ2YWx1ZSIsInNjaGVtYU1hcCIsImNvbnN0cnVjdG9yIiwiaW5pdGlhbFN0YXRlIiwiX3NjaGVtYSIsIl9yZXN1bHQiLCJfcmVxdWVzdFN0YXRlIiwiZGVmYXVsdE1ldGEiLCJyZXN1bHRSZXNldE9uRmV0Y2giLCJFbnRpdHlSZWR1Y2VyIiwic3RhdGUiLCJ0eXBlIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJzY2hlbWEiLCJyZXN1bHRLZXkiLCJzZXRJbiIsImZldGNoIiwidGVzdCIsImVycm9yIiwiZGVsZXRlSW4iLCJyZWR1Y2VkRGF0YSIsIl9rZXkiLCJ0b0pTIiwidG9PYmplY3QiLCJyZXN1bHQiLCJlbnRpdGllcyIsIm1lcmdlV2l0aCIsInByZXZFbnRpdHlUeXBlIiwibmV4dEVudGl0eVR5cGUiLCJwcmV2RW50aXR5SXRlbSIsIm5leHRFbnRpdHlJdGVtIiwibWVyZ2UiXSwibWFwcGluZ3MiOiI7Ozs7O1FBMkJnQkEsbUIsR0FBQUEsbUI7O0FBM0JoQjs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsU0FBU0Msa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxLQUFqQyxFQUF3QztBQUNwQyxXQUFPQSxLQUFQO0FBQ0g7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCTyxTQUFTSCxtQkFBVCxDQUE2QkksU0FBN0IsRUFBMEU7QUFBQSxRQUFsQ0MsV0FBa0MsdUVBQXBCSixrQkFBb0I7OztBQUU3RSxRQUFNSyxlQUFlLG9CQUFJO0FBQ3JCQyxpQkFBUyxvQkFBSUgsU0FBSixDQURZO0FBRXJCSSxpQkFBUyxxQkFGWTtBQUdyQkMsdUJBQWU7QUFITSxLQUFKLENBQXJCOztBQU1BLFFBQU1DLGNBQWM7QUFDaEJDLDRCQUFvQjtBQURKLEtBQXBCOztBQUlBO0FBQ0EsV0FBTyxTQUFTQyxhQUFULEdBQW9FO0FBQUEsWUFBN0NDLEtBQTZDLHVFQUFyQ1AsWUFBcUM7QUFBQTtBQUFBLFlBQXRCUSxJQUFzQixRQUF0QkEsSUFBc0I7QUFBQSxZQUFoQkMsT0FBZ0IsUUFBaEJBLE9BQWdCO0FBQUEsWUFBUEMsSUFBTyxRQUFQQSxJQUFPOztBQUFBLDZCQUtuRUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JSLFdBQWxCLEVBQStCTSxJQUEvQixDQUxtRTs7QUFBQSxtREFFbkVHLE1BRm1FO0FBQUEsWUFFbkVBLE1BRm1FLHlDQUUxRGYsVUFBVVUsSUFBVixDQUYwRDtBQUFBLG1EQUduRU0sU0FIbUU7QUFBQSxZQUduRUEsU0FIbUUseUNBR3ZETixJQUh1RDtBQUFBLFlBSW5FSCxrQkFKbUUsa0JBSW5FQSxrQkFKbUU7OztBQVF2RUUsZ0JBQVFBLE1BQU1RLEtBQU4sQ0FBWSxDQUFDLGVBQUQsRUFBa0JELFNBQWxCLENBQVosRUFBMEMsb0JBQUk7QUFDbERFLG1CQUFRLFdBQVdDLElBQVgsQ0FBZ0JULElBQWhCLENBRDBDO0FBRWxEVSxtQkFBUSxXQUFXRCxJQUFYLENBQWdCVCxJQUFoQixJQUF3QkMsT0FBeEIsR0FBa0M7QUFGUSxTQUFKLENBQTFDLENBQVI7O0FBTUE7QUFDQSxZQUFHSixzQkFBc0IsV0FBV1ksSUFBWCxDQUFnQlQsSUFBaEIsQ0FBekIsRUFBZ0Q7QUFDNUMsbUJBQU9ELE1BQU1ZLFFBQU4sQ0FBZSxDQUFDLFNBQUQsRUFBWUwsU0FBWixDQUFmLENBQVA7QUFDSDs7QUFFRCxZQUFHRCxVQUFVSixPQUFWLElBQXFCLGFBQWFRLElBQWIsQ0FBa0JULElBQWxCLENBQXhCLEVBQWlEO0FBQzdDO0FBQ0EsZ0JBQU1ZLGNBQWMsdUJBQU9YLE9BQVAsRUFBZ0Isb0NBQXFCVixXQUFyQixFQUFrQ2MsT0FBT1EsSUFBekMsQ0FBaEIsRUFBZ0VDLElBQWhFLEVBQXBCO0FBQ0E7O0FBSDZDLG1DQUlsQix1QkFBTywwQkFBVUYsV0FBVixFQUF1QlAsTUFBdkIsQ0FBUCxFQUF1Q1UsUUFBdkMsRUFKa0I7O0FBQUEsZ0JBSXRDQyxNQUpzQyxvQkFJdENBLE1BSnNDO0FBQUEsZ0JBSTlCQyxRQUo4QixvQkFJOUJBLFFBSjhCOzs7QUFNN0MsbUJBQU9sQjtBQUNIO0FBREcsYUFFRlEsS0FGRSxDQUVJLENBQUMsU0FBRCxFQUFZRCxTQUFaLENBRkosRUFFNEJVLE1BRjVCO0FBR0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVBHLGFBUUZFLFNBUkUsQ0FRUSxVQUFDQyxjQUFELEVBQWlCQyxjQUFqQixFQUFvQztBQUMzQyx1QkFBT0QsZUFDRkQsU0FERSxDQUNRLFVBQUNHLGNBQUQsRUFBaUJDLGNBQWpCLEVBQW9DO0FBQzNDLDJCQUFPRCxlQUFlRSxLQUFmLENBQXFCRCxjQUFyQixDQUFQO0FBQ0gsaUJBSEUsRUFHQUYsY0FIQSxDQUFQO0FBSUgsYUFiRSxFQWFBSCxRQWJBLENBQVA7QUFlSDs7QUFFRCxlQUFPbEIsS0FBUDtBQUNILEtBM0NEO0FBNENIIiwiZmlsZSI6IkNyZWF0ZUVudGl0eVJlZHVjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Zyb21KUywgTWFwLCBJdGVyYWJsZX0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7ZGVub3JtYWxpemV9IGZyb20gJ2Rlbm9ybWFsaXpyJztcbmltcG9ydCB7bm9ybWFsaXplfSBmcm9tICdub3JtYWxpenInO1xuaW1wb3J0IERldGVybWluZVJldml2ZXJUeXBlIGZyb20gJy4vdXRpbHMvRGV0ZXJtaW5lUmV2aXZlclR5cGUnO1xuXG5mdW5jdGlvbiBkZWZhdWx0Q29uc3RydWN0b3Ioa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgcmVkdWNlciB0aGF0IG5vcm1hbGl6ZXMgZGF0YSBiYXNlZCBvbiB0aGUgW25vcm1hbGl6cl0gc2NoZW1hcyBwcm92aWRlZC4gV2hlbiBhbiBhY3Rpb24gaXMgZmlyZWQsIGlmIHRoZSB0eXBlIG1hdGNoZXMgb25lIHByb3ZpZWQgaW4gYHNjaGVtYU1hcGAgdGhlIHBheWxvYWQgaXMgbm9ybWFsaXplZCBiYXNlZCBvZmYgdGhlIGdpdmVuIHNjaGVtYS5cbiAqIFRha2VzIGEgbWFwIG9mIHNjaGVtYXMgd2hlcmUgZWFjaCBrZXkgaXMgYW4gYWN0aW9uIG5hbWUgYW5kIHZhbHVlIGlzIGEgc2NoZW1hLiBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGtleSBjYWxsZWQgYG1haW5TY2hlbWFgIHJldHVybnMgYSByZWR1Y2VyIHRoYXQgaG9sZHMgdGhlIG1haW4gZW50aXR5IHN0YXRlLlxuICogYGBganNcbiAqIGltcG9ydCB7Y3JlYXRlRW50aXR5UmVkdWNlcn0gZnJvbSAncmVkdXgtYmx1ZWZsYWcnO1xuICogaW1wb3J0IEVudGl0eVNjaGVtYSBmcm9tICdteWFwcC9FbnRpdHlTY2hlbWEnO1xuICpcbiAqIGV4cG9ydCBkZWZhdWx0IGNvbWJpbmVSZWR1Y2Vycyh7XG4gKiAgICAgZW50aXR5OiBjcmVhdGVFbnRpdHlSZWR1Y2VyKHtcbiAqICAgICAgICAgR1JBUEhRTF9SRUNFSVZFOiBFbnRpdHlTY2hlbWEsXG4gKiAgICAgICAgIE1ZX0NVU1RPTV9BQ1RJT05fUkVDRUlWRTogRW50aXR5U2NoZW1hLm15Q3VzdG9tQWN0aW9uU2NlaGFtXG4gKiAgICAgfSksXG4gKiB9KTtcbiAqIGBgYFxuICogQGV4cG9ydHMgY3JlYXRlRW50aXR5UmVkdWNlclxuICogQHBhcmFtIHtvYmplY3R9IHNjaGVtYU1hcCAtIE1hcCBvZiBzY2hlbWEgYWN0aW9uIG5hbWVzLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY29uc3RydWN0b3IgLSBjb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBlZGl0IHBheWxvYWQgZGF0YSBiZWZvcmUgaXQgaXMgbm9ybWFsaXplZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eVJlZHVjZXIoc2NoZW1hTWFwLCBjb25zdHJ1Y3RvciA9IGRlZmF1bHRDb25zdHJ1Y3Rvcikge1xuXG4gICAgY29uc3QgaW5pdGlhbFN0YXRlID0gTWFwKHtcbiAgICAgICAgX3NjaGVtYTogTWFwKHNjaGVtYU1hcCksXG4gICAgICAgIF9yZXN1bHQ6IE1hcCgpLFxuICAgICAgICBfcmVxdWVzdFN0YXRlOiBNYXAoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGRlZmF1bHRNZXRhID0ge1xuICAgICAgICByZXN1bHRSZXNldE9uRmV0Y2g6IHRydWVcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gb3VyIGNvbnN0cnVjdGVkIHJlZHVjZXJcbiAgICByZXR1cm4gZnVuY3Rpb24gRW50aXR5UmVkdWNlcihzdGF0ZSA9IGluaXRpYWxTdGF0ZSwge3R5cGUsIHBheWxvYWQsIG1ldGF9KSB7XG4gICAgICAgIGNvbnN0IHtcbiAgICAgICAgICAgIHNjaGVtYSA9IHNjaGVtYU1hcFt0eXBlXSxcbiAgICAgICAgICAgIHJlc3VsdEtleSA9IHR5cGUsXG4gICAgICAgICAgICByZXN1bHRSZXNldE9uRmV0Y2gsXG4gICAgICAgIH0gPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0TWV0YSwgbWV0YSk7XG5cblxuICAgICAgICBzdGF0ZSA9IHN0YXRlLnNldEluKFsnX3JlcXVlc3RTdGF0ZScsIHJlc3VsdEtleV0sIE1hcCh7XG4gICAgICAgICAgICBmZXRjaCA6IC9fRkVUQ0gkL2cudGVzdCh0eXBlKSxcbiAgICAgICAgICAgIGVycm9yIDogL19FUlJPUiQvZy50ZXN0KHR5cGUpID8gcGF5bG9hZCA6IG51bGxcbiAgICAgICAgfSkpO1xuXG5cbiAgICAgICAgLy8gSWYgdGhlIGFjdGlvbiBpcyBhIEZFVENIIGFuZCB0aGUgdXNlciBoYXNuJ3QgbmVnYXRlZCB0aGUgcmVzdWx0UmVzZXRPbkZldGNoXG4gICAgICAgIGlmKHJlc3VsdFJlc2V0T25GZXRjaCAmJiAvX0ZFVENIJC9nLnRlc3QodHlwZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZS5kZWxldGVJbihbJ19yZXN1bHQnLCByZXN1bHRLZXldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHNjaGVtYSAmJiBwYXlsb2FkICYmIC9fUkVDRUlWRSQvZy50ZXN0KHR5cGUpKSB7XG4gICAgICAgICAgICAvLyByZXZpdmUgZGF0YSBmcm9tIHJhdyBwYXlsb2FkXG4gICAgICAgICAgICBjb25zdCByZWR1Y2VkRGF0YSA9IGZyb21KUyhwYXlsb2FkLCBEZXRlcm1pbmVSZXZpdmVyVHlwZShjb25zdHJ1Y3Rvciwgc2NoZW1hLl9rZXkpKS50b0pTKCk7XG4gICAgICAgICAgICAvLyBub3JtYWxpemUgdXNpbmcgcHJvdmVkIHNjaGVtYVxuICAgICAgICAgICAgY29uc3Qge3Jlc3VsdCwgZW50aXRpZXN9ID0gZnJvbUpTKG5vcm1hbGl6ZShyZWR1Y2VkRGF0YSwgc2NoZW1hKSkudG9PYmplY3QoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgICAgICAgICAgICAgLy8gc2V0IHJlc3VsdHNcbiAgICAgICAgICAgICAgICAuc2V0SW4oWydfcmVzdWx0JywgcmVzdWx0S2V5XSwgcmVzdWx0KVxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGVudGl0aWVzIG9ubHkgdGhyZWUgbGF5ZXJzIGRlZXBcbiAgICAgICAgICAgICAgICAvLyArIG1lcmdlcyBhbGwgZW50aXR5IHR5cGVzIHRvIHN0YXRlXG4gICAgICAgICAgICAgICAgLy8gKyBtZXJnZWQgYWxsIGVudGl0eSBpdGVtcyBpbnRvIGVhY2ggZW50aXR5IHR5cGVcbiAgICAgICAgICAgICAgICAvLyArIG1lcmdlcyB0aGUgdG9wLWxldmVsIGl0ZW1zIG9uIGVhY2ggZW50aXR5IGl0ZW1cbiAgICAgICAgICAgICAgICAvLyBidXQgd2lsbCBub3QgbWVyZ2UgYW55IGRlZXBlciBjb250ZW50cyBvZiBlbnRpdGllcyB0aGVtc2VsdmVzXG4gICAgICAgICAgICAgICAgLm1lcmdlV2l0aCgocHJldkVudGl0eVR5cGUsIG5leHRFbnRpdHlUeXBlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2RW50aXR5VHlwZVxuICAgICAgICAgICAgICAgICAgICAgICAgLm1lcmdlV2l0aCgocHJldkVudGl0eUl0ZW0sIG5leHRFbnRpdHlJdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZFbnRpdHlJdGVtLm1lcmdlKG5leHRFbnRpdHlJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIG5leHRFbnRpdHlUeXBlKTtcbiAgICAgICAgICAgICAgICB9LCBlbnRpdGllcyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG59XG4iXX0=
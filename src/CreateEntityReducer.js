import {fromJS, Map, Iterable} from 'immutable';
import {denormalize} from 'denormalizr';
import {normalize} from 'normalizr';



function defaultConstructor(key, value) {
    return value;
}

function determineReviverType(constructor, schemaKey) {
    return (key, value) => {
        // Check if the value is an array or object and convert to that for them.
        var isIndexed = Iterable.isIndexed(value);
        var returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(key || schemaKey, returnValue);
    }
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
export function createEntityReducer(schemaMap, constructor = defaultConstructor) {

    const initialState = fromJS({
        _schema: schemaMap,
        _result: {},
    });

    const defaultMeta = {
        resultResetOnFetch: true
    }

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta}) {
        var {
            schema = schemaMap[type],
            resultKey = type,
            resultResetOnFetch,
        } = Object.assign({}, defaultMeta, meta);

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            return state.deleteIn(['_result', resultKey]);
        }

        if(schema && payload) {
            // revive data from raw payload
            var reducedData = fromJS(payload, determineReviverType(constructor, schema._key)).toJS();
            // normalize using proved schema
            var {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

            // var resultData = (schema._key) ? Map().set(schema._key, result) : result;
            var resultData = result;

            return state
                // set results
                .setIn(['_result', resultKey], resultData)
                // merge entities
                .mergeDeep(entities);

        }

        return state;
    }
}

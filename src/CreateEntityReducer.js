import {fromJS, Map, Iterable} from 'immutable';
import {denormalize} from 'denormalizr';
import {normalize} from 'normalizr';
import DetermineReviverType from './utils/DetermineReviverType';

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
export function createEntityReducer(schemaMap, constructor = defaultConstructor) {

    const initialState = Map({
        _schema: Map(schemaMap),
        _result: Map(),
        _requestState: Map(),
    });

    const defaultMeta = {
        resultResetOnFetch: true
    }

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta}) {
        const {
            schema = schemaMap[type],
            resultKey = type,
            resultResetOnFetch,
        } = Object.assign({}, defaultMeta, meta);


        state = state.setIn(['_requestState', resultKey], Map({
            fetch : /_FETCH$/g.test(type),
            error : /_ERROR$/g.test(type) ? payload : null
        }));


        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            return state.deleteIn(['_result', resultKey]);
        }

        if(schema && payload && /_RECEIVE$/g.test(type)) {
            // revive data from raw payload
            const reducedData = fromJS(payload, DetermineReviverType(constructor, schema._key)).toJS();
            // normalize using proved schema
            const {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

            return state
                // set results
                .setIn(['_result', resultKey], result)
                // merge entities only three layers deep
                // + merges all entity types to state
                // + merged all entity items into each entity type
                // + merges the top-level items on each entity item
                // but will not merge any deeper contents of entities themselves
                .mergeWith((prevEntityType, nextEntityType) => {
                    return prevEntityType
                        .mergeWith((prevEntityItem, nextEntityItem) => {
                            return prevEntityItem.merge(nextEntityItem);
                        }, nextEntityType);
                }, entities);

        }

        return state;
    }
}

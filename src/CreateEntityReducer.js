import {fromJS, Map} from 'immutable';
import {normalize} from 'normalizr';
import DetermineReviverType from './utils/DetermineReviverType';

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
export function createEntityReducer(config) {

    const {
        schemaMap,
        beforeNormalize = defaultConstructor,
        afterNormalize = defaultConstructor,
        debug = false
    } = config;

    // set up debug logging
    var debugLog = () => {};
    var debugLogIf = () => {};
    if(debug) {
        console.log(`EntityReducer: debugging enabled`);
        debugLog = console.log;
        debugLogIf = (condition, ...args) => {
            if(condition) {
                console.log(...args);
            }
        };
    }

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

        debugLog(`\n\nEntityReducer: attempting to reduce with type "${type}"`);

        state = state.setIn(['_requestState', resultKey], Map({
            fetch : /_FETCH$/g.test(type),
            error : /_ERROR$/g.test(type) ? payload : null
        }));

        debugLog(`EntityReducer: setting _requestState for "${resultKey}"`);

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            debugLog(`EntityReducer: type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key`);
            return state.deleteIn(['_result', resultKey]);
        }

        if(/_RECEIVE$/g.test(type)) {
            debugLog(`EntityReducer: type is *_RECEIVE, will attempt to receive data`);

            if(schema && payload) {

                // revive data from raw payload
                debugLog(`EntityReducer: reviving data from raw payload and normalizing using provided schema`);
                const reducedData = fromJS(payload, DetermineReviverType(beforeNormalize, schema._key)).toJS();

                // normalize using provided schema
                const {result, entities} = fromJS(normalize(reducedData, schema))
                    // Map through entities and apply afterNormalize function
                    .updateIn(['entities'], entities => {
                        return entities.map((entity, key) => {
                            debugLog(`EntityReducer: ${entity.size} "${key}" ${entity.size == 1 ? 'entity' : 'entities'} normalized`);
                            return entity.map(ii => afterNormalize(ii, key));
                        })
                    })
                    .toObject();

                debugLogIf(entities.size == 0, `EntityReducer: 0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                debugLog(`EntityReducer: merging any normalized entities and result into state`);

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

            debugLogIf(!schema, `EntityReducer: schema is not defined, no entity data has been changed`);
            debugLogIf(!payload, `EntityReducer: payload is not defined, no entity data has been changed`);
        }

        debugLog(`EntityReducer: type is not *_RECEIVE, no entity data has been changed`);
        return state;
    }
}

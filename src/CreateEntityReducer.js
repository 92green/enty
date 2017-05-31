import {fromJS, Map} from 'immutable';
// import {normalize} from 'normalizr';
import normalize from './schema/Normalize';
import {
    RequestFetching,
    RequestError,
    RequestSuccess
} from 'fronads';
import MergeEntities from './utils/MergeEntities';
import Logger from './Logger';

function defaultConstructor(value) {
    return value;
}
/**
 * @module Creators
 */

/**
 * Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
 * Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called `mainSchema` returns a reducer that holds the main entity state.
 *
 * @example
 * import {createEntityReducer} from 'enty';
 * import EntitySchema from 'myapp/EntitySchema';
 *
 * export default combineReducers({
 *     entity: createEntityReducer({
 *          schemaMap: {
 *              GRAPHQL_RECEIVE: EntitySchema,
 *              MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSchema
 *          },
 *          afterNormalize: (value, key) => value,
 *     })
 * });
 *
 * @param {object} schemaMap - Map of schema action names.
 * @param {function} config.afterNormalize - config.afterNormalize function to edit payload data after it is normalized.
 * @return {function}
 * @memberof module:Creators
 *
 */
export function createEntityReducer(config) {
    const {
        schemaMap,
        afterNormalize = defaultConstructor
    } = config;

    const initialState = Map({
        _schema: Map(schemaMap),
        _result: Map(),
        _requestState: Map()
    });

    const defaultMeta = {
        resultResetOnFetch: true
    };

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta}) {
        Logger.info(`\n\nEntity reducer:`);

        const {
            schema = schemaMap[type],
            resultKey = type,
            resultResetOnFetch
        } = Object.assign({}, defaultMeta, meta);

        var [, actionTypePrefix] = resultKey.toString().match(/(.*)_(FETCH|ERROR|RECEIVE)$/) || [];

        const requestStatePath = ['_requestState', actionTypePrefix || resultKey];


        Logger.info(`Attempting to reduce with type "${type}"`);


        //
        // Set Request States for BLANK/FETCH/ERROR
        if(/_FETCH$/g.test(type)) {
            state = state.setIn(requestStatePath, RequestFetching());
        } else if(/_ERROR$/g.test(type)) {
            state = state.setIn(requestStatePath, RequestError(payload));
        }

        Logger.info(`Setting _requestState for "${resultKey}"`);

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            Logger.info(`Type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key`);
            return state.deleteIn(['_result', resultKey]);
        }


        if(/_RECEIVE$/g.test(type)) {
            Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

            // set success action before payload tests
            // to make sure the request state is still updated even if there is no payload
            state = state.setIn(requestStatePath, RequestSuccess());

            if(schema && payload) {
                // normalize using proved schema
                const {result, entities} = fromJS(schema.normalize(payload, schema)).toObject();

                Logger.infoIf(entities.size == 0, `0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                Logger.info(`Merging any normalized entities and result into state`);

                return state
                    // set results
                    .setIn(['_result', resultKey], result)
                    .update(MergeEntities(entities, afterNormalize));
            }


            Logger.infoIf(!schema, `Schema is not defined, no entity data has been changed`);
            Logger.infoIf(!payload, `Payload is not defined, no entity data has been changed`);
        }

        Logger.info(`Type is not *_RECEIVE, no entity data has been changed`);
        return state;
    };
}

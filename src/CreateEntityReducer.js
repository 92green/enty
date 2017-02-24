import {fromJS, Map, List, Iterable} from 'immutable';
import {normalize} from 'normalizr';
import DetermineReviverType from './utils/DetermineReviverType';
import MergeEntities from './utils/MergeEntities';
import Logger from './Logger';

function defaultConstructor(value) {
    return value;
}

/**
 * Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
 * Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called `mainSchema` returns a reducer that holds the main entity state.
 * ```js
 * import {createEntityReducer} from 'enty';
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
export function createEntityReducer(config) {
    const {
        schemaMap,
        beforeNormalize = defaultConstructor,
        afterNormalize = defaultConstructor
    } = config;

    const initialState = Map({
        _schema: Map(schemaMap),
        _result: Map(),
        _requestState: Map(),
    })

    const defaultMeta = {
        resultResetOnFetch: true
    }

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta}) {
        Logger.info(`\n\nEntity reducer:`);

        const {
            schema = schemaMap[type],
            resultKey = type,
            resultResetOnFetch,
        } = Object.assign({}, defaultMeta, meta);

        var [, actionTypePrefix] = resultKey.toString().match(/(.*)_(FETCH|ERROR|RECEIVE)$/) || [];

        //
        // ENTITY_DELETE takes a keypath as its payload
        // and sets a flag of `__deleted` on the entity
        //
        // ENTITY_UNDO_DELETE will set that flag to `false`
        //
        if(type === 'ENTITY_DELETE' || type === 'ENTITY_UNDO_DELETE') {
            let entityPath = List(payload).take(2);
            let deletedState = type === 'ENTITY_DELETE' ? true : false;
            if(state.getIn(entityPath)) {
                return state.setIn(entityPath.concat('__deleted'), deletedState);
            }
        }

        Logger.info(`Attempting to reduce with type "${type}"`);

        state = state.setIn(['_requestState', actionTypePrefix || resultKey], Map({
            fetch : /_FETCH$/g.test(type),
            error : /_ERROR$/g.test(type) ? payload : null
        }));

        Logger.info(`Setting _requestState for "${resultKey}"`);

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            Logger.info(`Type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key`);
            return state.deleteIn(['_result', resultKey]);
        }


        if(/_RECEIVE$/g.test(type)) {
            Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

            if(schema && payload) {

                // revive data from raw payload
                const reducedData = fromJS(payload, DetermineReviverType(beforeNormalize, schema._key)).toJS();
                // normalize using proved schema
                const {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

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
    }
}

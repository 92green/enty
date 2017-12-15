//@flow
import {Map} from 'immutable';

import {
    FetchingState,
    RefetchingState,
    ErrorState,
    SuccessState
} from './RequestState';
import Logger from './Logger';




/**
 *
 * @example
 * import {createEntityReducer} from 'enty';
 * import EntitySchema from 'myapp/EntitySchema';
 *
 * export default combineReducers({
 *     entity: EntityReducerFactory({
 *          schemaMap: {
 *              GRAPHQL_RECEIVE: EntitySchema,
 *              MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSchema
 *          }
 *     })
 * });
 *
 * @param {object} config.schemaMap - Map of schema action names.
 * @return {function}
 * @memberof module:Factories
 *
 */
export default function EntityReducerFactory(config: Object): Function {
    const {
        schemaMap
    } = config;

    const initialState = Map({
        _baseSchema: Map(schemaMap),
        _schemas: Map(),
        _result: Map(),
        _requestState: Map()
    });

    const defaultMeta = {
        resultResetOnFetch: false
    };

    // Return our constructed reducer
    return function EntityReducer(state: Map<any, any> = initialState, {type, payload, meta}: Object): Map<any, any> {
        // debugger;

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
            if(state.getIn(requestStatePath)) {
                Logger.info(`Setting RefetchingState for "${requestStatePath.join('.')}"`);
                state = state.setIn(requestStatePath, RefetchingState());
            } else {
                state = state.setIn(requestStatePath, FetchingState());
                Logger.info(`Setting FetchingState for "${requestStatePath.join('.')}"`, state);
            }
        } else if(/_ERROR$/g.test(type)) {
            Logger.info(`Setting ErrorState for "${requestStatePath.join('.')}"`);
            state = state.setIn(requestStatePath, ErrorState(payload));
        }



        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            Logger.info(`Type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key`);
            return state.deleteIn(['_result', resultKey]);
        }


        if(/_RECEIVE$/g.test(type)) {
            Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

            // set success action before payload tests
            // to make sure the request state is still updated even if there is no payload
            state = state.setIn(requestStatePath, SuccessState());

            if(schema && payload) {
                let previousEntities = state
                    .map(ii => ii.toObject())
                    .delete('_actionSchema')
                    .delete('_result')
                    .delete('_requestState')
                    .toObject();

                const {result, entities, schemas} = schema.normalize(payload, previousEntities);

                Logger.infoIf(entities.size == 0, `0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                Logger.info(`Merging any normalized entities and result into state`);

                return state
                    // set results
                    .update(state => state.merge(Map(entities).map(ii => Map(ii))))
                    .setIn(['_result', resultKey], result)
                    .updateIn(['_schemas'], (previous) => Map(schemas).merge(previous))
                    .update((state: *): * => {
                        Logger.silly('state', state);
                        return state;
                    })
                ;
            }


            Logger.infoIf(!schema, `Schema is not defined, no entity data has been changed`, state);
            Logger.infoIf(!payload, `Payload is not defined, no entity data has been changed`, state);
        }

        Logger.info(`Type is not *_RECEIVE, no entity data has been changed`, state);
        return state;
    };
}

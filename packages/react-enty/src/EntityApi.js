//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';
import type {Schema} from 'enty/lib/util/definitions';

import EntityQueryHockFactory from './EntityQueryHockFactory';
import RequestHockFactory from './RequestHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityReducerFactory from './EntityReducerFactory';
import EntityStoreFactory from './EntityStoreFactory';
import EntityProviderFactory from './EntityProviderFactory';
import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';

import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';

/**
 * The Entity Api is the main access point for your data. It allows you to define the link between your views
 * and the services that they fetch their data from.
 * Its main purpose it to:
 * 1. Construct a redux store from your schema.
 * 2. Create higher order components that connect data to your views.
 * Constructs an Entity Api based off a schema and an object of promise returning functions.
 *
 * EntityApi will construct RequestHocks for each promise returning function,
 * and a Redux store and reducer for your entity state.
 *
 * @param schema
 * A schema describing the relationships between your data
 *
 * @param actionMap
 * deep object representation of api functions
 *
 * @example
 * import {EntityApi} from 'enty';
 * import ApplicationSchema from './entity/ApplicationSchema';
 *
 * const Api = EntityApi(ApplicationSchema, {
 *     user: payload => post('/user', payload),
 *     article: {
 *         create: payload => post('/article', payload),
 *         list: payload => get('/article', payload)
 *     }
 * });
 *
 * export const {
 *     EntityStore,
 *
 *     UserRequestHock,
 *     ArticleCreateRequestHock,
 *     ArticleListRequestHock
 * } = Api;
 */
function EntityApi(schema: Schema<*>, actionMap: Object, hockOptions: HockOptionsInput = {}): Object {
    const {storeKey = 'enty'} = hockOptions;

    const reducer = EntityReducerFactory({schema});
    const store = EntityStoreFactory({reducer});
    const provider = EntityProviderFactory({store, storeKey});

    return pipeWith(
        actionMap,
        actionMap => visitActionMap(actionMap, (sideEffect, path) => {
            const actionName = path.join('_').toUpperCase();
            const FETCH = `${actionName}_FETCH`;
            const RECEIVE = `${actionName}_RECEIVE`;
            const ERROR = `${actionName}_ERROR`;
            const requestAction = createRequestAction(FETCH, RECEIVE, ERROR, sideEffect);

            const HockMeta = {
                // @TODO: internalize the hashing algorithm
                generateResultKey: (payload) => Hash({payload, actionName}),
                requestActionName: actionName,
                schemaKey: hockOptions.schemaKey, // @TODO remove this when there is only a single schema per api
                storeKey,
                stateKey: hockOptions.stateKey
            };

            return {
                _deprecated: {
                    query: EntityQueryHockFactory(requestAction, {...hockOptions, requestActionName: actionName}),
                    mutation: EntityMutationHockFactory(requestAction, {...hockOptions, requestActionName: actionName})
                },
                request: RequestHockFactory(requestAction, HockMeta)
            };
        }),
        set('_enty', {reducer, store}),
        set('EntityProvider', provider)

    );
}

export default EntityApi;

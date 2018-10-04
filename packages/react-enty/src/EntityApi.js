//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';
import type {Schema} from 'enty/lib/util/definitions';

import {createAction} from 'redux-actions';
import EntityQueryHockFactory from './EntityQueryHockFactory';
import RequestHockFactory from './RequestHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityReducerFactory from './EntityReducerFactory';
import EntityStoreFactory from './EntityStoreFactory';
import EntityProviderFactory from './EntityProviderFactory';
import {selectEntityByResult} from './EntitySelector';
import RequestStateSelector from './RequestStateSelector';
import Hash from './util/Hash';

import reduce from 'unmutable/lib/reduce';
import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';
import isKeyed from 'unmutable/lib/util/isKeyed';


//
// Recurse through deep objects and apply the visitor to
// anything that isnt another object.
//
function visitActionMap(branch: *, visitor: Function, path: string[] = [], state: * = {}): * {
    return pipeWith(
        branch,
        reduce(
            (reduction: *, item: *, key: string): * => {
                if(isKeyed(item)) {
                    reduction[key] = visitActionMap(item, visitor, path.concat(key), reduction);
                } else {
                    reduction[key] = visitor(item, path.concat(key));
                }
                return reduction;
            },
            state
        ),
    );
}

//
// Creates the redux-thunk promise action.
// Insetead of returning the dispatch function though. This uses the getState method
// to select the next denormalized state and return that to the promise chain.
// This means request functions can be chained, yet still contain the latests state.
//
export function createRequestAction(fetchAction: string, receiveAction: string, errorAction: string, sideEffect: SideEffect): Function {
    function action(aa: string): Function {
        return createAction(aa, (payload) => payload, (payload, meta) => meta);
    }
    return (requestPayload, meta = {}) => (dispatch: Function, getState: Function): Promise<*> => {
        var sideEffectMeta = {
            ...meta,
            dispatch,
            getState
        };

        var actionMeta = (resultKey) => ({
            ...meta,
            resultKey: meta.resultKey || resultKey
        });

        dispatch(action(fetchAction)(null, actionMeta(fetchAction)));
        return sideEffect(requestPayload, sideEffectMeta).then(
            (data: any): * => {
                dispatch(action(receiveAction)(data, actionMeta(receiveAction)));
                return selectEntityByResult(getState(), actionMeta(receiveAction).resultKey);
            },
            (error: any): * => {
                dispatch(action(errorAction)(error, actionMeta(errorAction)));
                return Promise.reject(RequestStateSelector(getState(), actionMeta(errorAction).resultKey).value());
            }
        );
    };
}


// @DEPRECATED
// This is only used by the mutation and query hocks
// RequestHoc has more powerful composition and so the actions dont need to be chained
export function createAllRequestAction(fetchAction: string, receiveAction: string, errorAction: string, sideEffectList: Array<SideEffect>): Function {
    function sideEffect(requestPayload: *, meta: Object): Promise<*> {
        return Promise
            // call all sideeffects
            .all(sideEffectList.map(effect => effect(requestPayload, meta)))
            // merge them back to one object
            .then(payloads => payloads.reduce((out, payload) => Object.assign(out, payload), {}))
        ;
    }
    return createRequestAction(fetchAction, receiveAction, errorAction, sideEffect);
}


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

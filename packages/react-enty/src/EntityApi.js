//@flow
import {createAction} from 'redux-actions';
import EntityQueryHockFactory from './EntityQueryHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityReducerFactory from './EntityReducerFactory';
import EntityStoreFactory from './EntityStoreFactory';
import {fromJS, Map} from 'immutable';

import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';
import type {Schema} from './util/definitions';


// Turns a nested object into a flat
// UPPER_SNAKE case representation
function reduceActionMap(branch: Map<string, any>, parentKey: string = ''): Map<string, any> {
    return branch.reduce((rr: Map<string, any>, ii: any, key: string): Map<string, any> => {
        var prefix = `${parentKey}${key}`;
        if(Map.isMap(ii)) {
            return rr.merge(reduceActionMap(ii, `${prefix}_`));
        } else {
            return rr.set(prefix, ii);
        }
    }, Map());
}

export function createRequestAction(fetchAction: string, recieveAction: string, errorAction: string, sideEffect: SideEffect): Function {
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

        dispatch(action(fetchAction)(null, {resultKey: meta.resultKey || fetchAction}));
        return sideEffect(requestPayload, sideEffectMeta).then(
            (data: any): Promise<any> => {
                return dispatch(action(recieveAction)(data, actionMeta(recieveAction)));
            },
            (error: any): Promise<any> => {
                return dispatch(action(errorAction)(error, {resultKey: meta.resultKey || errorAction}));
            }
        );
    };
}

export function createAllRequestAction(fetchAction: string, recieveAction: string, errorAction: string, sideEffectList: Array<SideEffect>): Function {
    function sideEffect(requestPayload: *, meta: Object): Promise<*> {
        return Promise
            // call all sideeffects
            .all(sideEffectList.map(effect => effect(requestPayload, meta)))
            // merge them back to one object
            .then(payloads => payloads.reduce((out, payload) => Object.assign(out, payload), {}))
        ;
    }
    return createRequestAction(fetchAction, recieveAction, errorAction, sideEffect);
}


/**
 * The Entity Api is the main access point for your data. It allows you to define the link between your views
 * and the services that they fetch their data from.
 * Its main purpose it to:
 * 1. Construct a redux store from your schema.
 * 2. Create higher order components that connect data to your views.
 * Constructs an Entity Api based off a schema and an object of promise returning functions.
 *
 * EntityApi will construct QueryHocks and MutationHocks for each promise returning function,
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
 *     core: payload => post('/graphql', payload),
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
 *     CoreQueryHock,
 *     CoreMutationHock,
 *     UserQueryHock,
 *     UserMutationHock,
 *     ArticleCreateQueryHock,
 *     ArticleCreateMutationHock,
 *     ArticleListQueryHock,
 *     ArticleListMutationHock
 * } = Api;
 */
function EntityApi(schema: Schema, actionMap: Object, hockOptions: HockOptionsInput = {}): Object {

    return reduceActionMap(fromJS(actionMap))
        .reduce((state: Map<string, any>, sideEffect: SideEffect, action: string): Map<string, any> => {

            const snakeAction = action.toUpperCase();

            const FETCH = `${snakeAction}_FETCH`;
            const RECEIVE = `${snakeAction}_RECEIVE`;
            const ERROR = `${snakeAction}_ERROR`;

            const requestAction = createRequestAction(FETCH, RECEIVE, ERROR, sideEffect);
            const requestActionPath = action.split('_');
            const requestActionName = action
                .split('_')
                .map(ss => ss.replace(/^./, mm => mm.toUpperCase()))
                .join('');


            hockOptions.requestActionName = requestActionName;

            return state
                // nested action creators
                .setIn(requestActionPath, requestAction)

                // root api
                .setIn(['actionTypes', FETCH], FETCH)
                .setIn(['actionTypes', RECEIVE], RECEIVE)
                .setIn(['actionTypes', ERROR], ERROR)
                .set(`${requestActionName}QueryHock`, EntityQueryHockFactory(requestAction, {...hockOptions, requestActionName}))
                .set(`${requestActionName}MutationHock`, EntityMutationHockFactory(requestAction, {...hockOptions, requestActionName}))
            ;

        }, Map())
        .update((api: Map<string, any>): Map<string, any> => {
            // convert receive actions to a standard that EntityReducerFactory can understand
            // {
            //     ACTION_RECIEVE: schema
            //     ...
            // }
            const schemaMap = api
                .get('actionTypes')
                .filter((action, key) => /_RECEIVE$/g.test(key))
                .reduce((schemaMap, key) => schemaMap.set(key, schema), Map())
                .set(hockOptions.schemaKey || 'ENTITY_RECEIVE', schema)
                .toObject()
            ;

            const reducer = EntityReducerFactory({schemaMap});

            return api
                .set('EntityReducer', reducer)
                .set('sideEffects', actionMap)
                .set('EntityStore', EntityStoreFactory(reducer));
        })
        .toJS();
}

export default EntityApi;

import {createAction} from 'redux-actions';
import EntityQueryHockFactory from './EntityQueryHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityReducerFactory from './EntityReducerFactory';
import EntityStoreFactory from './EntityStoreFactory';
import {fromJS, Map} from 'immutable';

/**
 * @module Creators
 */

//
// Turns a nested object into a flat
// UPPER_SNAKE case represention
function reduceActionMap(branch, parentKey = '') {
    return branch.reduce((rr, ii, key) => {
        var prefix = `${parentKey}${key.toUpperCase()}`;
        if(Map.isMap(ii)) {
            return rr.merge(reduceActionMap(ii, `${prefix}_`));
        } else {
            return rr.set(prefix, ii);
        }
    }, Map());
}

/*
 *
 * @param {string} fetchAction     action name for fetching action
 * @param {string} recieveAction   action name for receiving action
 * @param {string} errorAction     action name for error action
 * @param {function} sideEffect    Promise returning side effect to call after fetch action.
 * @return {array}            list of action creators and action types
 * @memberof module:Creators
 */
function createRequestAction(fetchAction, recieveAction, errorAction, sideEffect) {
    function action(aa) {
        return createAction(aa, (payload) => payload, (payload, meta) => meta);
    }
    return (requestPayload, meta = {}) => (dispatch, getState) => {
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
            (data) => {
                return Promise.resolve(dispatch(action(recieveAction)(data, actionMeta(recieveAction))));
            },
            (error) => {
                return Promise.reject(dispatch(createAction(errorAction)(error, {resultKey: meta.resultKey || errorAction})));
            }
        );
    };
}


/**
 * Constructs the Entity Api for use around the site
 *
 * @param  {object} schema          deep object representation of api functions
 * @param  {object} actionMap       deep object representation of api functions
 * @param  {object} selectOptions   deep object representation of api functions
 * @return {object}                 An Entity Api
 * @memberof module:Creators
 */
export default function EntityApi(schema, actionMap, selectOptions = {}) {
    return reduceActionMap(fromJS(actionMap))
        .reduce((state, sideEffect, action) => {

            const FETCH = `${action}_FETCH`;
            const RECEIVE = `${action}_RECEIVE`;
            const ERROR = `${action}_ERROR`;

            const requestAction = createRequestAction(FETCH, RECEIVE, ERROR, sideEffect);
            const requestActionPath = action.split('_').map(ii => ii.toLowerCase());
            const requestActionName = action
                .split('_')
                .map(ss => ss.toLowerCase().replace(/^./, mm => mm.toUpperCase()))
                .join('');

            return state
                // nested action creators
                .setIn(requestActionPath, requestAction)

                // root api
                .setIn(['actionTypes', FETCH], FETCH)
                .setIn(['actionTypes', RECEIVE], RECEIVE)
                .setIn(['actionTypes', ERROR], ERROR)
                .set(`${requestActionName}QueryHock`, EntityQueryHockFactory(requestAction, selectOptions))
                .set(`${requestActionName}MutationHock`, EntityMutationHockFactory(requestAction, selectOptions))
            ;

        }, Map())
        .update((api) => {
            // convert recieve actions to a standard that EntityReducerFactory can understand
            // {
            //     ACTION_RECIEVE: schema
            //     ...
            // }
            const actionMap = api
                .get('actionTypes')
                .filter((action, key) => /_RECEIVE$/g.test(key))
                .reduce((actionMap, key) => actionMap.set(key, schema), Map())
                .set(selectOptions.schemaKey || 'ENTITY_RECEIVE', schema)
                .toObject()
            ;

            const reducer = EntityReducerFactory({schemaMap: actionMap});

            return api
                .set('EntityReducer', reducer)
                .set('EntityStore', EntityStoreFactory(reducer));
        })
        // .update(ii => console.log(ii) || ii)
        .toJS();
}



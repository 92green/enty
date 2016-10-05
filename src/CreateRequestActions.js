import {createAction} from 'redux-actions';
import {fromJS, Map} from 'immutable';

/**
 * Given the return value of creatRequestActionSet it will log the names of the created action types and creators
 * @param  {object} actionMap map of actions
 * @param  {string} prefix    String to prefix actions types with
 */
export function logRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(createRequestActionSet(actionMap, prefix)).join('\n'));
}

//
// Turns a nested object into a flat
// UPPER_SNAKE case represention
export function reduceActionMap(branch, parentKey = '') {
    return branch.reduce((rr, ii, key) => {
        var prefix = `${parentKey}${key.toUpperCase()}`;
        if(Map.isMap(ii)) {
            return rr.merge(reduceActionMap(ii, `${prefix}_`));
        } else {
            return rr.set(prefix, ii);
        }
    }, Map())
}

/**
 * returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.
 * dispatch `fetchAction`
 * call `sideEffect`
 * then dispatch `recieveAction`
 * catch dispatch `errorAction`
 *
 * @param  {object} actionMap deep object representation of api functions
 * @return {array}            list of action creators and action types
 */
export function createRequestActionSet(actionMap) {
    return reduceActionMap(fromJS(actionMap))
        .map((sideEffect, action) => {
            const FETCH = `${action}_FETCH`;
            const RECEIVE = `${action}_RECEIVE`;
            const ERROR = `${action}_ERROR`;

            const requestActionName = action
                .split('_')
                .map(ss => ss.toLowerCase().replace(/^./, mm => mm.toUpperCase()))
                .join('');

            return Map()
                .set(`request${requestActionName}`, createRequestAction(FETCH, RECEIVE, ERROR, sideEffect))
                .set(FETCH, FETCH)
                .set(RECEIVE, RECEIVE)
                .set(ERROR, ERROR);

        })
        .flatten(1)
        .toJS();
}

export function createRequestAction(fetchAction, recieveAction, errorAction, sideEffect) {
    function action(aa) {
        return createAction(aa, (payload) => payload, (payload, meta) => meta)
    }
    return (requestPayload, meta = {}) => (dispatch, getState) => {
        var sideEffectMeta = {
            ...meta,
            dispatch,
            getState
        }

        var actionMeta = (resultKey) => ({
            ...meta,
            resultKey: meta.resultKey || resultKey
        });

        dispatch(action(fetchAction)(null, {resultKey: meta.resultKey || fetchAction}));
        return sideEffect(requestPayload, sideEffectMeta).then(
            (data) => {
                return Promise.resolve(dispatch(action(recieveAction)(data, actionMeta(recieveAction))))
            },
            (error) => {
                return dispatch(createAction(errorAction)(error, {resultKey: meta.resultKey || errorAction}));
            }
        )
    }
}

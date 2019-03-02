// @flow
import type {SideEffect} from '../util/definitions';

import {createAction} from 'redux-actions';
import {selectEntityByResult} from '../EntitySelector';
import RequestStateSelector from '../RequestStateSelector';

//
// Creates the redux-thunk promise action.
// Insetead of returning the dispatch function though. This uses the getState method
// to select the next denormalized state and return that to the promise chain.
// This means request functions can be chained, yet still contain the latests state.
//
export default function createRequestAction(fetchAction: string, receiveAction: string, errorAction: string, sideEffect: SideEffect): Function {
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

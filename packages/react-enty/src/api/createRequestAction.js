// @flow
import type {SideEffect} from '../util/definitions';
import type {Observable} from '../util/definitions';

import {selectEntityByResult} from '../EntitySelector';
import RequestStateSelector from '../RequestStateSelector';
import isObservable from '../util/isObservable';

//
// Creates the redux-thunk promise action.
// Insetead of returning the dispatch function though. This uses the getState method
// to select the next denormalized state and return that to the promise chain.
// This means request functions can be chained, yet still contain the latests state.
//

export default function createRequestAction(actionType: string, sideEffect: SideEffect): Function {
    return (requestPayload, meta = {}) => (dispatch: Function, getState: Function): Promise<*>|Observable => {

        const makeAction = (type) => (payload) => dispatch({
            type,
            payload,
            meta
        });

        var sideEffectMeta = {
            ...meta,
            dispatch,
            getState
        };

        const fetchAction = makeAction(`${actionType}_FETCH`);
        const receiveAction = makeAction(`${actionType}_RECEIVE`);
        const errorAction = makeAction(`${actionType}_ERROR`);

        const pending = sideEffect(requestPayload, sideEffectMeta);
        fetchAction(null);
        if(isObservable(pending)) {
            pending.subscribe({
                next: (data) => receiveAction(data),
                complete: () => selectEntityByResult(getState(), meta.resultKey),
                error: (error) => errorAction(error)
            });
            return pending;
        }
        return pending.then(
            (data: any): * => {
                receiveAction(data);
                return selectEntityByResult(getState(), meta.resultKey);
            },
            (error: any): * => {
                errorAction(error);
                return Promise.reject(RequestStateSelector(getState(), meta.resultKey).value());
            }
        );
    };
}

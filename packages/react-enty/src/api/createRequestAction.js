// @flow
import type {SideEffect} from '../util/definitions';

import {selectEntityByResult} from '../EntitySelector';
import RequestStateSelector from '../RequestStateSelector';

//
// Creates the redux-thunk promise action.
// Insetead of returning the dispatch function though. This uses the getState method
// to select the next denormalized state and return that to the promise chain.
// This means request functions can be chained, yet still contain the latests state.
//

export default function createRequestAction(actionType: string, sideEffect: SideEffect): Function {
    return (requestPayload, meta = {}) => (dispatch: Function, getState: Function): Promise<*> => {

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

        fetchAction(null);
        return sideEffect(requestPayload, sideEffectMeta).then(
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

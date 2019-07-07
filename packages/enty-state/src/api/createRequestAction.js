// @flow
import type {SideEffect} from '../util/definitions';
import type {AsyncType} from '../util/definitions';

import isObservable from '../util/isObservable';


type Meta = {
    resultKey: string
};

//
// Creates the redux-thunk promise action.
// Insetead of returning the dispatch function though. This uses the getState method
// to select the next denormalized state and return that to the promise chain.
// This means request functions can be chained, yet still contain the latests state.
//

export default function createRequestAction(actionType: string, sideEffect: SideEffect): Function {
    return (requestPayload, meta: Meta) => (dispatch: Function, getState: Function): AsyncType => {

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
            // $FlowFixMe - flow can't do a proper disjoint union between promises and other things
            pending.subscribe({
                next: (data) => receiveAction(data),
                complete: (data) => receiveAction(data),
                error: (error) => errorAction(error)
            });
            return pending;
        }

        // $FlowFixMe - see above
        return pending.then(
            (data: any): * => {
                receiveAction(data);
                return data;
            },
            (error: any): * => {
                errorAction(error);
                return Promise.reject(error);
            }
        );
    };
}

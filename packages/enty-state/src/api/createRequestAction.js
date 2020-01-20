// @flow
import type {SideEffect} from '../util/definitions';

import isObservable from '../util/isObservable';


type Meta = {
    responseKey: string
};

export default function createRequestAction(sideEffect: SideEffect): Function {
    return (requestPayload, meta: Meta) => (dispatch: Function, getState: Function): Promise<*> => {

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

        const fetchAction = makeAction(`ENTY_FETCH`);
        const receiveAction = makeAction(`ENTY_RECEIVE`);
        const errorAction = makeAction(`ENTY_ERROR`);

        const pending = sideEffect(requestPayload, sideEffectMeta);
        fetchAction(null);
        if(isObservable(pending)) {

            let promiseCallbacks = {};
            let promise = new Promise((resolve, reject) => {
                promiseCallbacks.resolve = resolve;
                promiseCallbacks.reject = reject;
            });

            // $FlowFixMe - flow can't do a proper disjoint union between promises and other things
            pending.subscribe({
                next: (data) => {
                    receiveAction(data);
                    promiseCallbacks.resolve(data);
                },
                complete: (data) => {
                    receiveAction(data);
                    promiseCallbacks.resolve(data);
                },
                error: (error) => {
                    errorAction(error);
                    promiseCallbacks.reject(error);
                }
            });

            return promise;
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

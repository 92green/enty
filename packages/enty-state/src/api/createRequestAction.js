// @flow
import type {SideEffect} from '../util/definitions';

import isObservable from '../util/isObservable';


type Meta = {
    responseKey: string,
    returnResponse?: boolean
};

export default function createRequestAction(sideEffect: SideEffect): Function {
    return (requestPayload, meta: Meta) => (dispatch: Function, getState: Function)  => {

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
            // $FlowFixMe - flow can't do a proper disjoint union between promises and other things
            pending.subscribe({
                next: (data) => receiveAction(data),
                complete: (data) => receiveAction(data),
                error: (error) => errorAction(error)
            });
        } else {
            // $FlowFixMe - see above
            pending.then(receiveAction).catch(err => {
                errorAction(err);
                return meta.returnResponse ? Promise.reject(err) : undefined;
            });
        }

        return meta.returnResponse ? pending : undefined;

    };
}

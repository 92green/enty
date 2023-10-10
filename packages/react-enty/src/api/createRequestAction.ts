import {SideEffect, Dispatch, State, Action} from '../util/definitions';

export default function createRequestAction(sideEffect: SideEffect) {
    return <P>(requestPayload: P, meta: Action['meta']) =>
        (dispatch: Dispatch, getState: () => State) => {
            const makeAction =
                <T>(type: Action['type']) =>
                (payload: T) =>
                    dispatch({
                        type,
                        payload,
                        meta
                    });

            var sideEffectMeta = {
                ...meta,
                dispatch,
                getState
            };

            const fetchAction = makeAction<null>(`ENTY_FETCH`);
            const receiveAction = makeAction<P>(`ENTY_RECEIVE`);
            const errorAction = makeAction<unknown>(`ENTY_ERROR`);
            const pending = sideEffect(requestPayload, sideEffectMeta);

            fetchAction(null);
            if ('subscribe' in pending) {
                pending.subscribe({
                    next: (data: P) => receiveAction(data),
                    complete: (data: P) => receiveAction(data),
                    error: (error: Error) => errorAction(error)
                });
            } else if ('then' in pending) {
                pending.then(receiveAction).catch((err) => {
                    errorAction(err);
                    return meta.returnResponse ? Promise.reject(err) : undefined;
                });
            } else {
                (async () => {
                    try {
                        for await (const data of pending) {
                            receiveAction(data);
                        }
                    } catch (err) {
                        errorAction(err);
                    }
                })();
            }

            return meta.returnResponse ? pending : undefined;
        };
}

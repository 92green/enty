import {SideEffect} from './definitions';

type Meta = {
    responseKey: string;
    returnResponse?: boolean;
};

export default function createRequestAction(sideEffect: SideEffect): Function {
    return (requestPayload, meta: Meta) => (dispatch: Function, getState: Function) => {
        const makeAction = (type) => (payload) =>
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

        const fetchAction = makeAction(`ENTY_FETCH`);
        const receiveAction = makeAction(`ENTY_RECEIVE`);
        const errorAction = makeAction(`ENTY_ERROR`);
        const pending = sideEffect(requestPayload, sideEffectMeta);

        fetchAction(null);
        if ('subscribe' in pending) {
            // $FlowFixMe - flow can't do a proper disjoint union between promises and other things
            pending.subscribe({
                next: (data) => receiveAction(data),
                complete: (data) => receiveAction(data),
                error: (error) => errorAction(error)
            });
        } else if ('then' in pending) {
            // $FlowFixMe - see above
            pending.then(receiveAction).catch((err) => {
                errorAction(err);
                return meta.returnResponse ? Promise.reject(err) : undefined;
            });
        } else {
            (async () => {
                try {
                    // $FlowFixMe - flow can't do a proper disjoint union between promises and other things
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

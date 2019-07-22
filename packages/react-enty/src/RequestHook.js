// @flow
import Message from 'enty-state/lib/data/Message';
import RequestState from 'enty-state/lib/data/RequestState';
import {useState, useContext, useCallback, useMemo, useRef} from 'react';

type RequestHookConfig = {
    actionType: string,
    requestAction: Function,
    generateResultKey: Function
};

export default function RequestHookFactory(context: *, config: RequestHookConfig) {
    const {requestAction, generateResultKey} = config;

    return () => {
        const [responseKey, setResultKey] = useState();
        const store = useContext(context);
        if(!store) throw 'useRequest must be called in a provider';
        const [state, dispatch] = store;
        const responseRef = useRef();

        let requestState = state.requestState[responseKey] || RequestState.empty();

        let response = useMemo(() => {
            const schema = state.baseSchema;
            const result = state.response[responseKey];
            const entities = state.entities;
            if(schema) {
                return schema.denormalize({entities, result});
            }
            return result;

        }, [requestState, responseKey, state.responseCount]);

        responseRef.current = response;

        let onRequest = useCallback((payload) => {
            const responseKey = generateResultKey(payload);
            setResultKey(responseKey);
            return dispatch(requestAction(payload, {responseKey}))
                .then(() => responseRef.current)
                .catch(() => {});
        });


        return useMemo(() => new Message({
            responseKey,
            requestState,
            response,
            requestError: state.error[responseKey],
            onRequest
        }), [requestState, response, responseKey]);
    };
}

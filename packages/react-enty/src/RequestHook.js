// @flow
import Message from 'enty-state/lib/data/Message';
import {EmptyState} from 'enty-state/lib/data/RequestState';
import {useState, useContext, useCallback, useMemo, useRef} from 'react';

type RequestHookConfig = {
    actionType: string,
    requestAction: Function,
    generateResultKey: Function
};

export default function RequestHookFactory(context: *, config: RequestHookConfig) {
    const {requestAction, generateResultKey} = config;

    return () => {
        const [reponseKey, setResultKey] = useState();
        const store = useContext(context);
        if(!store) throw 'useRequest must be called in a provider';
        const [state, dispatch] = store;
        const responseRef = useRef();

        let requestState = state.requestState[reponseKey] || EmptyState();

        let response = useMemo(() => {
            const schema = state.baseSchema;
            const result = state.response[reponseKey];
            const entities = state.entities;
            if(schema) {
                return schema.denormalize({entities, result});
            }
            return result;

        }, [requestState, reponseKey, state.responseCount]);

        responseRef.current = response;

        let onRequest = useCallback((payload) => {
            const reponseKey = generateResultKey(payload);
            setResultKey(reponseKey);
            return dispatch(requestAction(payload, {reponseKey}))
                .then(() => responseRef.current)
                .catch(() => {});
        });


        return useMemo(() => new Message({
            reponseKey,
            requestState,
            response,
            requestError: state.error[reponseKey],
            onRequest
        }), [requestState, response, reponseKey]);
    };
}

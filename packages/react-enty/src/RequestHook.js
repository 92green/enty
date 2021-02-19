// @flow
import Message from 'enty-state/lib/data/Message';
import RequestState from 'enty-state/lib/data/RequestState';
import {useState, useEffect, useContext, useCallback, useMemo, useRef} from 'react';

type RequestHookConfig = {
    actionType: string,
    requestAction: Function,
    resetAction: Function,
    removeEntityAction: Function,
    generateResultKey: Function
};

type Config = {
    key?: string,
    responseKey?: string
};

export default function RequestHookFactory(context: *, config: RequestHookConfig) {
    const {requestAction, resetAction, removeEntityAction, generateResultKey} = config;

    return <R>(config: Config = {}) => {
        const [derivedResponseKey, setDerivedResponseKey] = useState('Unknown');
        const responseKey = config.responseKey || (config.key ? generateResultKey(config.key) : derivedResponseKey);
        const store = useContext(context);
        if(!store) throw 'useRequest must be called in a provider';
        const [state, dispatch, baseMeta] = store;
        const responseRef = useRef();
        const mounted = useRef(true);

        let requestState = state.requestState[responseKey] || RequestState.empty();

        useEffect(() => {
            return () => {
                mounted.current = false;
            };
        }, []);

        let response = useMemo(() => {
            const schema = state.baseSchema;
            const result = state.response[responseKey];
            const entities = state.entities;
            if(schema) {
                return schema.denormalize({entities, result});
            }
            return result;

        }, [requestState, responseKey, state.stats.responseCount]);

        responseRef.current = response;

        let request = useCallback((payload, {returnResponse = false} = {}) => {
            const responseKey = config.responseKey || generateResultKey(config.key || payload);
            setDerivedResponseKey(responseKey);
            return dispatch(requestAction(payload, {...baseMeta, responseKey, returnResponse}));
        }, [baseMeta]);

        let reset = useCallback(() => dispatch(resetAction(responseKey)));
        let removeEntity = useCallback((type, id) => dispatch(removeEntityAction(type, id)));


        return useMemo(() => new Message<R>({
            removeEntity,
            request,
            requestError: state.error[responseKey],
            requestState,
            reset,
            response,
            responseKey
        }), [requestState, response, responseKey]);
    };
}

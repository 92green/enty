import {Message, ApiRequest} from 'enty-state';
import {useCallback, useRef, useMemo} from 'react';
import {useStore} from './StoreContext';

type RequestHookConfig = {
    request: ApiRequest;
    key: string;
};

export default function useMessage(config: RequestHookConfig) {
    const apiItem = config.request;
    const keyRef = useRef<string | null>(null);
    const {store} = useStore();
    if (!store) throw 'useMessage must be called in a provider';
    keyRef.current = `${apiItem.path}:${config.key}`;

    let {error: requestError, state: requestState, response} = useMemo(() => {
        return store.getRequest(keyRef.current);
    }, [store.normalizeCount]);

    return useMemo(
        () =>
            new Message({
                requestError,
                requestState,
                request: (payload) => apiItem.request(payload, {key: keyRef.current}),
                response
            }),
        [requestState]
    );
}

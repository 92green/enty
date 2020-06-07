import {SideEffect, AsyncType} from './definitions';
import EntityStore from './EntityStore';

type Meta = {
    key: string;
};

export default function createRequestAction<A>(
    store: EntityStore<A>,
    sideEffect: SideEffect
): Function {
    return <A>(requestPayload: A, meta: Meta) => {
        const {key} = meta;
        const success = <D>(data: D) => store.updateRequest(key, 'success', data);
        const error = <D>(data: D) => store.updateRequest(key, 'error', data);

        store.updateRequest(key, 'pending', {});
        const pending: AsyncType = sideEffect(requestPayload, {key, store});
        if ('subscribe' in pending) {
            pending.subscribe({next: success, complete: success, error: error});
        } else if ('then' in pending) {
            pending.then(success).catch(error);
        } else {
            (async () => {
                try {
                    for await (const data of pending) {
                        success(data);
                    }
                } catch (err) {
                    error(err);
                }
            })();
        }
    };
}

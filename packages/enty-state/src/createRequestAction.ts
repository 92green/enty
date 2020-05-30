import {SideEffect, AsyncType} from './definitions';
import EntityStore from './EntityStore';

type Meta = {
    key: string;
};

export default function createRequestAction(sideEffect: SideEffect, Store: EntityStore): Function {
    return <A>(requestPayload: A, meta: Meta) => {
        const {key} = meta;
        const success = <D>(data: D) => Store.updateRequest(key, 'success', data);
        const error = <D>(data: D) => Store.updateRequest(key, 'error', data);

        Store.updateRequest(key, 'pending', {});
        const pending: AsyncType = sideEffect(requestPayload, meta);
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

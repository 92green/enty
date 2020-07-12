import {Schema} from 'enty/lib/util/definitions';

import EntityApiFactory from 'enty-state/lib/EntityApiFactory';
import ProviderFactory from './ProviderFactory';
import RequestHoc from './RequestHoc';
import RequestHook from './RequestHook';
import RemoveHook from './RemoveHook';
import RemoveHoc from './RemoveHoc';

type ActionMap = {
    [key: string]: any;
};

export default function EntityApi(actionMap: ActionMap, schema?: Schema) {
    const {Provider, ProviderHoc, Context} = ProviderFactory({schema});

    let api = EntityApiFactory(actionMap, (actionConfig) => {
        const useRequest = RequestHook(Context, actionConfig);
        return {
            useRequest,
            requestHoc: RequestHoc({useRequest})
        };
    });

    const useRemove = RemoveHook(Context);

    api.Provider = Provider;
    api.ProviderHoc = ProviderHoc;
    api.useRemove = useRemove;
    api.RemoveHoc = RemoveHoc({useRemove});

    return api;
}

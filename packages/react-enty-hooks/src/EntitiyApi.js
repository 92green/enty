//@flow
import type {Schema} from 'enty/lib/util/definitions';

import EntityApiFactory from 'enty-state/lib/EntityApiFactory';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';
import ProviderFactory from './ProviderFactory';
import RequestHoc from './RequestHoc';
import RequestHook from './RequestHook';

type ActionMap = {
    +[string]: ActionMap|Function
};

export default function EntityApi(schema: Schema<*>, actionMap: ActionMap): Object {
    const initialState = {};
    const {Provider, ProviderHoc, Context} = ProviderFactory({
        reducer: EntityReducerFactory({schema}),
        initialState: {}
    });

    let api = EntityApiFactory(
        actionMap,
        (actionConfig) => ({
            useRequest: RequestHook(actionConfig),
            requestHoc: RequestHoc(actionConfig)
        })
    );

    api.Provider = Provider;
    api.ProviderHoc = ProviderHoc;

    return api;
};


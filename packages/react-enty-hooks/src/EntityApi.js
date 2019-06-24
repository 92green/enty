//@flow
import type {Schema} from 'enty/lib/util/definitions';

import EntityApiFactory from 'enty-state/lib/EntityApiFactory';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';
import ProviderFactory from './ProviderFactory';
import RequestHoc from './RequestHoc';
import RequestHook from './RequestHook';


type ActionMap = {
    [key: string]: *
};

type HookConfig = {
    actionType: string,
    requestAction: Function,
    generateResultKey: Function,
    context: *
};

export default function EntityApi(schema: Schema<*>, actionMap: ActionMap): Object {
    const initialState = {};

    const {Provider, ProviderHoc, Context} = ProviderFactory({
        reducer: EntityReducerFactory({schema})
    });

    let api = EntityApiFactory(
        actionMap,
        (actionConfig) => ({
            useRequest: RequestHook(Context, actionConfig),
            requestHoc: RequestHoc(Context, actionConfig)
        })
    );

    api.Provider = Provider;
    api.ProviderHoc = ProviderHoc;

    return api;
};


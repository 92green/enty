import {Schema} from 'enty';
import {ProviderConfig} from './ProviderFactory';

import type {Message} from './data/Message';
import EntityApiFactory from './EntityApiFactory';
import ProviderFactory from './ProviderFactory';
import RequestHoc from './RequestHoc';
import RequestHook from './RequestHook';
import RemoveHook from './RemoveHook';
import RemoveHoc from './RemoveHoc';

export type Request<T> = {
    //_messageType: Message<T, E>;
    useRequest: <U = void>(options?: {
        key?: string | null;
        responseKey?: string;
    }) => Message<U extends void ? T : U>;
    requestHoc: (options: {
        name: string;
        auto?: boolean | string[];
        key?: (a: any) => any;
        shouldComponentAutoRequest?: (props: any) => boolean;
        payloadCreator?: (props: any) => any;
        optimistic?: boolean;
        updateResultKey?: (resultKey: string, props: any) => string;
    }) => (component: React.ComponentType<any>) => React.ComponentType<any>;
};

type RequestFunction = (variables?: any, meta?: any) => Promise<any> | {subscribe: Function};

type MappedTransform<T> = {
    [K in keyof T]?: T[K] extends RequestFunction
        ? Request<ReturnType<T[K]>>
        : MappedTransform<T[K]>;
};

type Extras = {
    Provider: any;
    ProviderHoc: any;
    useRemove: any;
    RemoveHoc: any;
};

export default function EntityApi<A>(
    actionMap: A,
    schema?: Schema,
    results?: ProviderConfig['results']
): MappedTransform<A> & Extras {
    const {Provider, ProviderHoc, Context} = ProviderFactory({
        schema,
        results
    });

    let api = EntityApiFactory(actionMap, actionConfig => {
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

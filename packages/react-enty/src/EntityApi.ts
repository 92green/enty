import {Schema} from 'enty';
import {ProviderConfig} from './ProviderFactory';

import type {Message} from './data/Message';
import ProviderFactory from './ProviderFactory';
import RequestHook from './RequestHook';
import RemoveHook from './RemoveHook';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';
import {SideEffect} from './util/definitions';

export type Request<T, V> = {
    useRequest: (options?: {key?: string | null; responseKey?: string}) => Message<T, V>;
};

type RequestFunction = (variables?: any, meta?: any) => Promise<any> | AsyncIterator<any>;

type MappedTransform<T> = {
    [K in keyof T]: T[K] extends SideEffect
        ? Request<
              Awaited<ReturnType<T[K]>>,
              Parameters<T[K]>[0] extends undefined ? void : Parameters<T[K]>[0]
          >
        : MappedTransform<T[K]>;
};

type Extras = {
    Provider: any;
    ProviderHoc: any;
    useRemove: any;

    createRequestHook: <R extends SideEffect>(config: {
        name: string;
        request: R;
        schema?: Schema<any>;
    }) => (options?: {
        key?: string;
        responseKey?: string;
    }) => Message<
        Awaited<ReturnType<R>>,
        Parameters<R>[0] extends undefined ? void : Parameters<R>[0]
    >;
};

interface ActionMap extends Record<string, ActionMap | RequestFunction> {}

export default function EntityApi<A extends ActionMap>(
    actionMap: A,
    schema?: Schema<any>,
    results?: ProviderConfig['results']
) {
    const {Provider, ProviderHoc, Context} = ProviderFactory({
        schema,
        results
    });

    let api: Extras & MappedTransform<A> = visitActionMap(
        actionMap,
        (sideEffect: () => Promise<any>, path: string[]) => {
            const requestAction = createRequestAction(sideEffect);
            const useRequest = RequestHook(Context, {
                schema,
                name: `api.${path.join('.')}`,
                requestAction
            });
            return {
                useRequest
            };
        }
    );

    const useRemove = RemoveHook(Context);

    api.Provider = Provider;
    api.ProviderHoc = ProviderHoc;
    api.useRemove = useRemove;
    api.createRequestHook = (config) =>
        RequestHook(Context, {
            name: config.name,
            schema: config.schema,
            requestAction: createRequestAction(config.request)
        });

    return api;
}

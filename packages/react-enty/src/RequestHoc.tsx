import React from 'react';
import {ApiRequest, Message} from 'enty-state';
import {useEffect} from 'react';
import useMessage from './RequestHook';

type Config = {
    useRequest: Function;
};

type HockConfig = {
    name: string;
    key: (props: unknown) => string;
    request: ApiRequest;
    auto?: boolean | Array<string>;
    shouldComponentAutoRequest?: (props: any) => boolean;
    payloadCreator?: (props: any) => any;
};

const returnTrue: (payload?: unknown) => boolean = () => true;
const returnObject: (payload?: unknown) => unknown = () => {};
const identity = (x) => x;

export default function MessageHoc(hockConfig: HockConfig) {
    const {name, request, key} = hockConfig;
    const {auto = false} = hockConfig;
    const {payloadCreator = auto ? returnObject : identity} = hockConfig;
    const {shouldComponentAutoRequest = returnTrue} = hockConfig;

    if (!name) throw 'requestHoc must be given a name';
    if (!request) throw 'requestHoc must be given a request';
    if (!key) throw 'requestHoc must be given a key function';

    return (Component: any) => (props: any) => {
        const message = useMessage({
            key: hockConfig.key(props),
            request
        }).update((message: Message) => ({
            ...message,
            // attach payload creator to message
            request: (payload) => message.request(payloadCreator(payload))
        }));

        const autoValues = (typeof auto === 'boolean' ? [] : auto).map((path) => {
            let ii = props;
            for (let key of path.split('.')) {
                ii = ii?.[key];
            }
            return JSON.stringify(ii);
        });

        useEffect(() => {
            if (auto && shouldComponentAutoRequest(props)) {
                message.request(props);
            }
        }, autoValues);

        const newProps = {
            ...props,
            [name]: message
        };

        return <Component {...newProps} />;
    };
}

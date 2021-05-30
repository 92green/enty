import React, {useMemo} from 'react';
import {useEffect} from 'react';
import getIn from 'unmutable/getIn';
import identity from 'unmutable/identity';
import pipeWith from 'unmutable/pipeWith';

type Config = {
    useRequest: Function;
};

type HockConfig = {
    name: string;
    auto?: boolean | Array<string>;
    key?: (props: unknown) => string;
    responseKey?: (props: unknown) => string;
    shouldComponentAutoRequest?: (props: any) => boolean;
    payloadCreator?: (props: any) => any;
};

const returnTrue: (payload?: unknown) => boolean = () => true;
const returnObject: (payload?: unknown) => unknown = () => {};

export default function RequestHocFactory({useRequest}: Config) {
    return (hockConfig: HockConfig) => {
        const {name} = hockConfig;
        const {auto = false} = hockConfig;
        const {payloadCreator = auto ? returnObject : identity()} = hockConfig;
        const {shouldComponentAutoRequest = returnTrue} = hockConfig;

        if (!name) {
            throw 'requestHoc must be given a name';
        }

        return (Component: any) => (props: any) => {
            let message = useRequest({
                key: hockConfig.key && hockConfig.key(props),
                responseKey: hockConfig.responseKey && hockConfig.responseKey(props)
            });

            message = useMemo(() => {
                return message.update(message => ({
                    ...message,
                    // attach payload creator to message
                    request: (payload, ...rest) => message.request(payloadCreator(payload), ...rest)
                }));
            }, [message]);

            const autoValues = (typeof auto === 'boolean' ? [] : auto).map(path =>
                pipeWith(props, getIn(path.split('.')), value => JSON.stringify(value))
            );

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
    };
}

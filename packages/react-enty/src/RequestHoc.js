// @flow
import React from 'react';
import {useEffect} from 'react';
import getIn from 'unmutable/getIn';
import identity from 'unmutable/identity';
import pipeWith from 'unmutable/pipeWith';

type Config = {
    useRequest: Function
};

type HockConfig = {
    name: string,
    auto?: boolean|Array<string>,
    key?: (props: mixed) => string,
    responseKey?: (props: mixed) => string,
    shouldComponentAutoRequest?: (props: *) => boolean,
    payloadCreator?: (props: *) => *
};

const returnTrue: (payload?: mixed) => boolean = () => true;
const returnObject: (payload?: mixed) => mixed = () => {};

export default function RequestHocFactory({useRequest}: Config) {
    return (hockConfig: HockConfig) => {
        const {name} = hockConfig;
        const {auto = false} = hockConfig;
        const {payloadCreator = auto ? returnObject : identity()} = hockConfig;
        const {shouldComponentAutoRequest = returnTrue} = hockConfig;

        if(!name) {
            throw 'requestHoc must be given a name';
        }

        return (Component: *) => (props: *) => {
            const message = useRequest({
                key: hockConfig.key && hockConfig.key(props),
                responseKey: hockConfig.responseKey && hockConfig.responseKey(props)
            })
                .update(message => ({
                    ...message,
                    // attach payload creator to message
                    request: (payload, ...rest) => message.request(payloadCreator(payload), ...rest)
                }));

            const autoValues = (typeof auto === 'boolean' ? [] : auto)
                .map(path => pipeWith(
                    props,
                    getIn(path.split('.')),
                    value => JSON.stringify(value)
                ));


            useEffect(() => {
                if(auto && shouldComponentAutoRequest(props)) {
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

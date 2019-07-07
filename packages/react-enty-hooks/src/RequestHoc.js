// @flow
import React from 'react';
import {useEffect} from 'react';
import getIn from 'unmutable/lib/getIn';
import identity from 'unmutable/lib/identity';

type Config = {
    useRequest: Function
};

type HockConfig = {
    name: string,
    auto?: boolean|Array<string>,
    shouldComponentAutoRequest?: (props: *) => boolean,
    payloadCreator?: (props: *) => *,
    updateResultKey?: (resultKey: string, props: *) => string,
    mapResponseToProps?: boolean|Function
};

const returnTrue: (payload?: mixed) => boolean = () => true;
const returnObject: (payload?: mixed) => mixed = () => {};

export default function RequestHocFactory({useRequest}: Config) {
    return (hockConfig: HockConfig) => {
        const {name} = hockConfig;
        const {auto = false} = hockConfig;
        const {payloadCreator = auto ? returnObject : identity()} = hockConfig;
        const {shouldComponentAutoRequest = returnTrue} = hockConfig;
        const {mapResponseToProps} = hockConfig;

        if(!name) {
            throw 'requestHoc must be given a name';
        }

        return (Component: *) => (props: *) => {
            const message = useRequest();

            const autoValues = (typeof auto === 'boolean' ? [] : auto)
                .map(path => getIn(path.split('.'))(props));

            useEffect(() => {
                if(auto && shouldComponentAutoRequest(props)) {
                    message.onRequest(payloadCreator(props));
                }
            }, autoValues);


            let mappedProps = {};
            if(mapResponseToProps === true) {
                mappedProps = message.response;
            } else if(typeof mapResponseToProps === 'function') {
                mappedProps = mapResponseToProps(message.response);
            }

            const newProps = {
                ...props,
                ...mappedProps,
                [name]: message
            };

            return <Component {...newProps} />;
        };
    };
}

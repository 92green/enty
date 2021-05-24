import {ComponentType} from 'react';
import {AbstractComponent} from 'react';
import Message from './data/Message';

import React from 'react';
import LoadingBoundary from './LoadingBoundary';

type Config = {
    name: string;
    empty?: ComponentType<any>;
    error?: ComponentType<any>;
    fallback?: ComponentType<any>;
    fallbackOnRefetch?: boolean;
    mapResponseToProps?: (response: unknown) => Object;
};

type HocProps<R, E> = {
    [name: string]: Message<R, E>;
};

const returnObject: (payload?: unknown) => Object = () => ({});

export default function LoadingBoundaryHoc(config: Config) {
    const {mapResponseToProps = returnObject, name, ...remainingConfig} = config;

    return function LoadingBoundaryApplier<R, E, Props extends {} & HocProps<R, E>>(
        Component: AbstractComponent<Props>
    ): AbstractComponent<Props> {
        return (props) => {
            const message: Message<R, E> = props[name];
            return (
                <LoadingBoundary
                    {...remainingConfig}
                    message={message}
                    children={(response) => {
                        let childProps = mapResponseToProps(response);
                        childProps[name] = message;
                        return <Component {...props} {...childProps} />;
                    }}
                />
            );
        };
    };
}

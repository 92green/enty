import {ComponentType} from 'react';
import Message from 'enty/lib/state/Message';

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

type HocProps<R> = {
    [name: string]: Message<R>;
};

const returnObject: (payload?: unknown) => Object = () => ({});

export default function LoadingBoundaryHoc(config: Config) {
    const {mapResponseToProps = returnObject, name, ...remainingConfig} = config;

    return function LoadingBoundaryApplier<R, E, Props extends {} & HocProps<R>>(
        Component: ComponentType<Props>
    ) {
        return (props: Props & HocProps<R>) => {
            const message: Message<R> = props[name];
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

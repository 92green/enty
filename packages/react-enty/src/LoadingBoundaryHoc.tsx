import {ComponentType} from 'react';
import {Message} from 'enty-state';

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

type HocProps = {
    [name: string]: Message;
};

const returnObject: (payload?: unknown) => Object = () => ({});

export default function LoadingBoundaryHoc(config: Config) {
    const {mapResponseToProps = returnObject, name, ...remainingConfig} = config;

    return function LoadingBoundaryApplier<Props extends {} & HocProps>(
        Component: ComponentType<Props>
    ) {
        return (props: Props) => {
            const message: Message = props[name];
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


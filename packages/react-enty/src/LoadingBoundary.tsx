import {ReactNode} from 'react';
import {FunctionComponent} from 'react';
import {ComponentType} from 'react';
import {Message} from 'enty-state';

import React from 'react';

type Props = {
    children: (response: unknown, arg1: {refetching: boolean}) => ReactNode;
    message: Message;
    fallbackOnRefetch?: boolean;
    fallback?: ComponentType<any>;
    error?: ComponentType<any>;
    empty?: ComponentType<any>;
};

const NullRender = () => null;

const LoadingBoundary: FunctionComponent<Props> = (props) => {
    // Config
    const {children} = props;
    const {message} = props;
    const {fallbackOnRefetch = false} = props;
    const {fallback: Fallback = NullRender} = props;
    const {empty: Empty = NullRender} = props;
    const {error: Error = NullRender} = props;

    // Possible States
    const emptyState = () => <Empty />;
    const errorState = () => <Error error={message.requestError} />;
    const fallbackState = () => <Fallback />;
    const renderState = () =>
        children(message.response, {refetching: message.isRefetching === true});

    // Render
    return message
        .emptyMap(emptyState)
        .fetchingMap(fallbackState)
        .refetchingMap(fallbackOnRefetch ? fallbackState : renderState)
        .successMap(renderState)
        .errorMap(errorState).value;
};

export default LoadingBoundary;

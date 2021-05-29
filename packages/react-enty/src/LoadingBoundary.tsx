import {ReactNode} from 'react';
import {ComponentType} from 'react';
import Message from './data/Message';

import React from 'react';

type Props<R, E> = {
    children: (response: unknown, arg1: {refetching: boolean}) => ReactNode;
    message: Message<R, E>;
    fallbackOnRefetch?: boolean;
    fallback?: ComponentType<any>;
    error?: ComponentType<any>;
    empty?: ComponentType<any>;
};

const NullRender = () => null;

export default function LoadingBoundary<R, E>(props: Props<R, E>) {
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
        children(message.response, {
            refetching: message.requestState.isRefetching === true
        });

    // Render
    return message.requestState
        .emptyMap(emptyState)
        .fetchingMap(fallbackState)
        .refetchingMap(fallbackOnRefetch ? fallbackState : renderState)
        .successMap(renderState)
        .errorMap(errorState)
        .value();
}

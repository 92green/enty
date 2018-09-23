//@flow
import type {Node} from 'react';
import React from 'react';
import {createProvider} from 'react-redux';

type Config = {
    store: *,
    storeKey: string
};

export default function EntityProviderFactory({store, storeKey}: Config): Function {
    const Provider = createProvider(storeKey);
    return function EntityProvider(props: *): Node {
        return <Provider store={store} children={props.children} />;
    };
}

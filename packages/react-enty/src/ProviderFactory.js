// @flow
import type {ComponentType} from 'react';
import type {Element} from 'react';

import React, {createContext} from 'react';
import useReducerThunk from './util/useReducerThunk';

type ProviderConfig = {
    reducer: Function
};

type ProviderFactoryReturn = {
    Context: {},
    Provider: ComponentType<any>,
    ProviderHoc: Function
};

type ProviderProps = {
    children: Element<any>,
    initialState?: {}
};


export default function ProviderFactory(config: ProviderConfig): ProviderFactoryReturn {
    const {reducer} = config;
    const Context = createContext();

    const initialAction = {type: 'ENTY_INIT'};

    function Provider({children, initialState}: ProviderProps): Element<any> {
        return <Context.Provider
            value={useReducerThunk(reducer, reducer(initialState, initialAction))}
            children={children}
        />;
    }

    const ProviderHoc = () => (Component) => ({initialState, ...rest}) => <Provider initialState={initialState}>
        <Component {...rest} />
    </Provider>;

    return {
        Provider,
        ProviderHoc,
        Context
    };

}

// @flow
import type {ComponentType} from 'react';
import type {Element} from 'react';

import React, {createContext} from 'react';
import useReducerThunk from './util/useReducerThunk';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';
import LoggingReducer from 'enty-state/lib/util/LoggingReducer';
import type {Schema} from 'enty/lib/util/definitions';

type ProviderConfig = {
    schema?: Schema
};

type ProviderFactoryReturn = {
    Context: {
        Provider: ComponentType<*>,
        Consumer: ComponentType<*>
    },
    Provider: ComponentType<any>,
    ProviderHoc: Function
};

type ProviderProps = {
    children: Element<any>,
    debug?: boolean,
    initialState?: {}
};


export default function ProviderFactory(config: ProviderConfig): ProviderFactoryReturn {
    const {schema} = config;
    const entityReducer = EntityReducerFactory({schema});
    const Context = createContext();

    function Provider({children, initialState, debug}: ProviderProps): Element<any> {
        const initialAction = {type: 'ENTY_INIT'};
        const reducer = debug
            ? (state, action) => LoggingReducer(entityReducer(state, action), action)
            : entityReducer;

        return <Context.Provider
            value={useReducerThunk(reducer, reducer(initialState, initialAction))}
            children={children}
        />;
    }


    const ProviderHoc = () => (Component) => ({initialState, ...rest}: ProviderProps) => <Provider initialState={initialState}>
        <Component {...rest} />
    </Provider>;

    return {
        Provider,
        ProviderHoc,
        Context
    };

}

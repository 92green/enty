// @flow
import type {ComponentType} from 'react';
import type {Element} from 'react';

import React, {createContext, useMemo} from 'react';
import useReducerThunk from './util/useReducerThunk';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';
import LoggingReducer from 'enty-state/lib/util/LoggingReducer';
import type {Action} from 'enty-state/lib/util/definitions';
import type {Schema} from 'enty/lib/util/definitions';

export type ProviderConfig = {
    schema?: Schema,
    results?: Array<{
        responseKey: string,
        payload: any,
        type?: 'ENTY_RECEIVE' | 'ENTY_ERROR' | 'ENTY_FETCH'
    }>
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
    debug?: string,
    initialState?: {},
    meta?: {}
};


export default function ProviderFactory(config: ProviderConfig): ProviderFactoryReturn {
    const {schema, results = []} = config;
    const entityReducer = EntityReducerFactory({schema});
    const Context = createContext();

    function Provider({children, initialState, debug, meta}: ProviderProps): Element<any> {

        const firstState = {
            baseMeta: meta,
            baseSchema: schema,
            schemas: {},
            response: {},
            error: {},
            requestState: {},
            entities: {},
            stats: {
                responseCount: 0
            },
            ...initialState
        };

        const {reducer, intialValue} = useMemo(() => {
            const reducer = debug
                ? (state, action: Action) => LoggingReducer(entityReducer(state, action), action, debug)
                : entityReducer;

            const intialValue = [
                {type: 'ENTY_INIT', payload: null, meta: {...meta, responseKey: 'Unknown'}},
                ...results.map(({responseKey, payload, type = 'ENTY_RECEIVE'}) => ({type, payload, meta: {...meta, responseKey}}))

            ].reduce(reducer, firstState);

            return {
                reducer,
                intialValue
            };
        }, [debug, initialState]);

        const storeValue = useReducerThunk(reducer, intialValue);


        return <Context.Provider
            value={storeValue}
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

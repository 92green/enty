import {ComponentType} from 'react';
import {ReactNode} from 'react';

import React, {createContext, useMemo} from 'react';
import useReducerThunk from './util/useReducerThunk';
import EntityReducerFactory from 'enty-state/lib/EntityReducerFactory';
import LoggingReducer from 'enty-state/lib/util/LoggingReducer';
import {Action} from 'enty-state/lib/util/definitions';
import {State} from 'enty-state/lib/util/definitions';
import {Schema} from 'enty/lib/util/definitions';

type ProviderConfig = {
    schema?: Schema;
};

export type ProviderContext = React.Context<[State, Function] | null>;

type ProviderFactoryReturn = {
    Context: ProviderContext;
    Provider: ComponentType<any>;
    ProviderHoc: Function;
};

type ProviderProps = {
    children: ReactNode;
    debug?: string;
    initialState?: {};
};

export default function ProviderFactory(config: ProviderConfig): ProviderFactoryReturn {
    const {schema} = config;
    const entityReducer = EntityReducerFactory({schema});
    const Context = createContext<[State, Function] | null>(null);

    function Provider({children, initialState, debug}: ProviderProps) {
        const firstState = {
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
                ? (state, action: Action) =>
                      LoggingReducer(entityReducer(state, action), action, debug)
                : entityReducer;
            return {
                reducer,
                intialValue: reducer(firstState, {
                    type: 'ENTY_INIT',
                    payload: null,
                    meta: {responseKey: 'Unknown'}
                })
            };
        }, [debug, firstState]);

        const storeValue = useReducerThunk(reducer, intialValue);

        return <Context.Provider value={storeValue} children={children} />;
    }

    const ProviderHoc = () => (Component) => ({initialState, ...rest}: ProviderProps) => (
        <Provider initialState={initialState}>
            <Component {...rest} />
        </Provider>
    );

    return {
        Provider,
        ProviderHoc,
        Context
    };
}

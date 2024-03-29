import {ComponentType} from 'react';
import {ReactNode} from 'react';

import React, {createContext, useMemo, Context} from 'react';
import useReducerThunk from './util/useReducerThunk';
import EntityReducerFactory from './EntityReducerFactory';
import LoggingReducer from './util/LoggingReducer';
import {State, Action, ProviderContextType} from './util/definitions';
import {Schema} from 'enty';

export type ProviderConfig = {
    schema?: Schema<any>;
    results?: Array<{
        responseKey: string;
        payload: any;
        type?: 'ENTY_RECEIVE' | 'ENTY_ERROR' | 'ENTY_FETCH';
    }>;
};

type ProviderFactoryReturn = {
    Context: Context<ProviderContextType | null>;
    Provider: ComponentType<any>;
    ProviderHoc: Function;
};

type ProviderProps = {
    children: ReactNode;
    debug?: boolean;
    initialState?: {};
    meta?: any; //@todo
};

export default function ProviderFactory(config: ProviderConfig): ProviderFactoryReturn {
    const {schema, results = []} = config;
    const entityReducer = EntityReducerFactory({schema});
    const Context = createContext<ProviderContextType | null>(null);

    function Provider(props: ProviderProps) {
        const {children, initialState, debug} = props;

        const meta = useMemo(() => {
            return {...props.meta};
        }, [props.meta]);

        const firstState: State = {
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
                ? (state: State, action: Action) =>
                      LoggingReducer(entityReducer(state, action), action)
                : entityReducer;

            const intialValue: State = [
                {
                    type: 'ENTY_INIT',
                    payload: null,
                    meta: {...meta, responseKey: 'Unknown'}
                } as Action,
                ...results.map<Action>(({responseKey, payload, type = 'ENTY_RECEIVE'}) => ({
                    type,
                    payload,
                    meta: {...meta, responseKey}
                }))
            ].reduce<State>(reducer, firstState);

            return {
                reducer,
                intialValue
            };
        }, [debug, initialState, meta]);

        const storeValue = useReducerThunk(reducer, intialValue, meta);

        return <Context.Provider value={storeValue} children={children} />;
    }

    const ProviderHoc =
        () =>
        (Component: ComponentType<any>) =>
        ({initialState, ...rest}: ProviderProps) =>
            (
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

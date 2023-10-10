import {Schema} from 'enty';

export type Observable = {
    subscribe: Function;
};

export type GetState = () => State;
export type Dispatch = (
    action: Action | ((dispatch: Dispatch, getState: GetState) => void)
) => void;
export type SideEffect = (
    variables: any,
    meta: any
) => Promise<any> | Observable | AsyncGenerator<any, any, any>;
export type ProviderContextType = [State, Dispatch, Record<string, any>];

export type State = {
    schemas: Record<string, Schema>;
    response: Record<string, any>;
    error: Record<string, any>;
    requestState: Record<string, any>;
    entities: Record<string, any>;
    stats: {
        responseCount: number;
    };
};

export type Action = {
    type: 'ENTY_FETCH' | 'ENTY_ERROR' | 'ENTY_RECEIVE' | 'ENTY_REMOVE' | 'ENTY_RESET' | 'ENTY_INIT';
    payload?: any;
    meta: {
        name: string;
        schema?: Schema;
        responseKey: string;
        returnResponse?: boolean;
    };
};

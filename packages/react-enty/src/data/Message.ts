import RequestState from '../data/RequestState';

export type MessageInput<T, V> = {
    requestError?: any;
    response?: T;
    removeEntity?: (type: string, id: string) => void;
    request: <R extends boolean>(
        payload: V,
        config?: {returnResponse: R}
    ) => R extends true ? Promise<T> : void;
    reset?: () => void;
    responseKey?: string;
};

export abstract class BaseMessage<T, V> {
    response?: T;
    data?: T;
    requestError?: any;
    error?: any;
    request: <R extends boolean>(
        payload: V,
        config?: {returnResponse: R}
    ) => R extends true ? Promise<T> : void;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    abstract readonly state: string;
    abstract readonly isEmpty: boolean;
    abstract readonly isFetching: boolean;
    abstract readonly isRefetching: boolean;
    abstract readonly isPending: boolean;
    abstract readonly isLoading: boolean;
    abstract readonly isSuccess: boolean;
    abstract readonly isError: boolean;
    abstract readonly requestState: RequestState;

    constructor(props: MessageInput<T, V>) {
        this.responseKey = props.responseKey || '';
        this.response = props.response;
        this.requestError = props.requestError;
        this.error = props.requestError;
        this.request = props.request || ((_: any) => {});
        this.reset = props.reset || (() => {});
        this.removeEntity = props.removeEntity || (() => {});
    }
}

export class EmptyMessage<V> extends BaseMessage<undefined, V> {
    readonly state = 'empty';
    readonly requestState = RequestState.empty();
    readonly isEmpty = true;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isLoading = false;
    readonly isSuccess = false;
    readonly isError = false;
}

export class FetchingMessage<V> extends BaseMessage<undefined, V> {
    readonly state = 'fetching';
    readonly requestState = RequestState.fetching();
    readonly isEmpty = false;
    readonly isFetching = true;
    readonly isRefetching = false;
    readonly isPending = true;
    readonly isLoading = true;
    readonly isSuccess = false;
    readonly isError = false;
}

export class RefetchingMessage<T, V> extends BaseMessage<T, V> {
    declare response: T;
    declare data: T;
    readonly state = 'refetching';
    readonly requestState = RequestState.refetching();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = true;
    readonly isPending = true;
    readonly isLoading = true;
    readonly isSuccess = false;
    readonly isError = false;
    constructor(input: MessageInput<T, V> & {response: T}) {
        super(input);
        this.response = input.response;
        this.data = input.response;
    }
}

export class SuccessMessage<T, V> extends BaseMessage<T, V> {
    declare response: T;
    declare data: T;
    readonly state = 'success';
    readonly requestState = RequestState.success();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isLoading = false;
    readonly isSuccess = true;
    readonly isError = false;
    constructor(input: MessageInput<T, V> & {response: T}) {
        super(input);
        this.response = input.response;
        this.data = input.response;
    }
}

export class ErrorMessage<T, V> extends BaseMessage<T, V> {
    readonly state = 'success';
    readonly requestState = RequestState.error();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isLoading = false;
    readonly isSuccess = false;
    readonly isError = true;
    declare requestError: any;
    declare error: any;
    constructor(input: MessageInput<T, V> & {requestError: Error}) {
        super(input);
        this.requestError = input.requestError;
        this.error = input.requestError;
    }
}

export type Message<T, V> =
    | EmptyMessage<V>
    | FetchingMessage<V>
    | RefetchingMessage<T, V>
    | SuccessMessage<T, V>
    | ErrorMessage<T, V>;

export function unknownMessage<T, V>(input: any): Message<T, V> {
    let UnknownMessage: any = EmptyMessage;
    if (input.requestState.isFetching) UnknownMessage = FetchingMessage;
    if (input.requestState.isRefetching) UnknownMessage = RefetchingMessage;
    if (input.requestState.isSuccess) UnknownMessage = SuccessMessage;
    if (input.requestState.isError) UnknownMessage = ErrorMessage;

    return new UnknownMessage({
        removeEntity: input.removeEntity,
        request: input.request,
        requestError: input.requestError,
        reset: input.reset,
        response: input.response,
        responseKey: input.responseKey
    });
}

export default Message;

export const MessageFactory = {
    empty(messageProps: MessageInput<any, any>) {
        return new EmptyMessage({
            ...messageProps,
            response: undefined,
            requestError: undefined
        });
    },

    fetching(messageProps: MessageInput<any, any>) {
        return new FetchingMessage({
            ...messageProps,
            response: undefined
        });
    },

    refetching<R, P>(messageProps: MessageInput<R, P> & {response: R}) {
        return new RefetchingMessage({...messageProps});
    },

    success<R, P>(messageProps: MessageInput<R, P> & {response: R}) {
        return new SuccessMessage({...messageProps});
    },

    error<R, P>(messageProps: MessageInput<R, P> & {requestError: Error}) {
        return new ErrorMessage({...messageProps});
    }
};

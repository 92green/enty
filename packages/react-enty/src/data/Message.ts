import RequestState from '../data/RequestState';

type Request = (payload?: unknown, config?: {returnResponse: boolean}) => any;

type MessageInput<R> = {
    requestError?: Error;
    response?: R;
    removeEntity?: (type: string, id: string) => void;
    request?: Request;
    reset?: () => void;
    responseKey?: string;
};

export abstract class BaseMessage<R> {
    response?: R;
    requestError?: Error;
    request: Request;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    abstract readonly state: string;
    abstract readonly isEmpty: boolean;
    abstract readonly isFetching: boolean;
    abstract readonly isRefetching: boolean;
    abstract readonly isPending: boolean;
    abstract readonly isSuccess: boolean;
    abstract readonly isError: boolean;
    abstract readonly requestState: RequestState;

    constructor(props: MessageInput<R>) {
        this.responseKey = props.responseKey || '';
        this.response = props.response;
        this.requestError = props.requestError;
        this.request = props.request || (() => {});
        this.reset = props.reset || (() => {});
        this.removeEntity = props.removeEntity || (() => {});
    }

    get data() {
        return this.response;
    }

    get error() {
        return this.requestError;
    }

    //
    // Response Getters

    get<K extends keyof R, N = undefined>(key: K, notSetValue?: N): R[K] | N | undefined {
        if (!(key in (this.response || {}))) return notSetValue;
        return this.response?.[key];
    }

    getIn<K1 extends keyof R, K2 extends keyof R[K1], K3 extends keyof R[K1][K2]>(
        path: [K1, K2, K3]
    ): R[K1][K2][K3];
    getIn<K1 extends keyof R, K2 extends keyof R[K1]>(path: [K1, K2]): R[K1][K2];
    getIn<K1 extends keyof R>(path: [K1]): R[K1];
    getIn(path: string[], notSetValue?: any): any {
        return path.reduce<Record<string, any>>((value, key) => {
            if (value === Object(value) && key in value) return value[key];
            return notSetValue;
        }, this.response || {});
    }

    //
    // Updating Methods

    update<B extends MessageInput<any>>(
        updater: (a: BaseMessage<any>) => B
    ): Message<B['response']> {
        return unknownMessage(updater({...this}));
    }

    //
    // empty
}

export class EmptyMessage extends BaseMessage<undefined> {
    readonly state = 'empty';
    readonly requestState = RequestState.empty();
    readonly isEmpty = true;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isSuccess = false;
    readonly isError = false;
}

export class FetchingMessage extends BaseMessage<undefined> {
    readonly state = 'fetching';
    readonly requestState = RequestState.fetching();
    readonly isEmpty = false;
    readonly isFetching = true;
    readonly isRefetching = false;
    readonly isPending = true;
    readonly isSuccess = false;
    readonly isError = false;
}

export class RefetchingMessage<T> extends BaseMessage<T> {
    response: T;
    readonly state = 'refetching';
    readonly requestState = RequestState.refetching();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = true;
    readonly isPending = true;
    readonly isSuccess = false;
    readonly isError = false;
    constructor(input: MessageInput<T> & {response: T}) {
        super(input);
        this.response = input.response;
    }
}

export class SuccessMessage<T> extends BaseMessage<T> {
    response: T;
    readonly state = 'success';
    readonly requestState = RequestState.success();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isSuccess = true;
    readonly isError = false;
    constructor(input: MessageInput<T> & {response: T}) {
        super(input);
        this.response = input.response;
    }
}

export class ErrorMessage<T> extends BaseMessage<T> {
    readonly state = 'success';
    readonly requestState = RequestState.error();
    readonly isEmpty = false;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isSuccess = false;
    readonly isError = true;
    constructor(input: MessageInput<T>) {
        super(input);
        this.requestError = input.requestError;
    }
}

export type Message<T> =
    | EmptyMessage
    | FetchingMessage
    | RefetchingMessage<T>
    | SuccessMessage<T>
    | ErrorMessage<T>;

export function unknownMessage<T>(input: any): Message<T> {
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
    empty<R>(messageProps: MessageInput<R>) {
        return new EmptyMessage({
            ...messageProps,
            response: undefined,
            requestError: undefined
        });
    },

    fetching<R>(messageProps?: MessageInput<R>) {
        return new FetchingMessage({
            ...messageProps,
            response: undefined
        });
    },

    refetching<R>(messageProps: MessageInput<R> & {response: R}) {
        return new RefetchingMessage({...messageProps});
    },

    success<R>(messageProps: MessageInput<R> & {response: R}) {
        return new SuccessMessage({...messageProps});
    },

    error<R>(messageProps?: MessageInput<R>) {
        return new ErrorMessage({...messageProps});
    }
};

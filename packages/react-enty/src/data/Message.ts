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

//}

export abstract class BaseMessage<R = void> {
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

    get<K extends keyof R, N = undefined>(key: K, notSetValue?: N): R[K] | N {
        if (!(key in (this.response || {}))) return notSetValue;
        return this.response?.[key];
    }

    getIn<K1 extends keyof R, K2 extends keyof R[K1], K3 extends keyof R[K1][K2]>(
        path: [K1, K2, K3]
    ): R[K1][K2][K3];
    getIn<K1 extends keyof R, K2 extends keyof R[K1]>(path: [K1, K2]): R[K1][K2];
    getIn<K1 extends keyof R>(path: [K1]): R[K1];
    getIn(path: string[], notSetValue?: any): any {
        return path.reduce((value, key) => {
            if (value === Object(value) && key in value) return value[key];
            return notSetValue;
        }, this.response || {});
    }

    //
    // Updating Methods

    update<B>(updater): Message<B> {
        return unknownMessage(updater({...this, requestState: this.requestState}));
    }

    //
    // empty

    static empty<R>(messageProps: MessageInput<R>) {
        return new EmptyMessage({
            ...messageProps,
            response: undefined,
            requestError: undefined
        });
    }

    static fetching<R>(messageProps?: MessageInput<R>) {
        return new FetchingMessage({
            ...messageProps,
            response: undefined
        });
    }

    static refetching<R>(messageProps?: MessageInput<R>) {
        return new RefetchingMessage({...messageProps});
    }

    static success<R>(messageProps?: MessageInput<R>) {
        return new SuccessMessage({...messageProps});
    }

    static error<R>(messageProps?: MessageInput<R>) {
        return new ErrorMessage({...messageProps});
    }
}

export class EmptyMessage extends BaseMessage {
    readonly state = 'empty';
    readonly requestState = RequestState.empty();
    readonly isEmpty = true;
    readonly isFetching = false;
    readonly isRefetching = false;
    readonly isPending = false;
    readonly isSuccess = false;
    readonly isError = false;
}

export class FetchingMessage extends BaseMessage {
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
    constructor(input: MessageInput<T>) {
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
    constructor(input: MessageInput<T>) {
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
    let message;
    if (input.requestState.isEmpty) message = EmptyMessage;
    if (input.requestState.isFetching) message = FetchingMessage;
    if (input.requestState.isRefetching) message = RefetchingMessage;
    if (input.requestState.isSuccess) message = SuccessMessage;
    if (input.requestState.isError) message = ErrorMessage;

    return new message({
        removeEntity: input.removeEntity,
        request: input.request,
        requestError: input.requestError,
        reset: input.reset,
        response: input.response,
        responseKey: input.responseKey
    });
}

export default Message;

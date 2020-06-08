type Request = (payload?: unknown) => any;
type RequestState = 'empty' | 'fetching' | 'refetching' | 'success' | 'error';

type MessageInput = {
    request: Request;
    requestError: any;
    requestState?: RequestState;
    response: any;
    value?: any;
};

export default class Message {
    // Data
    requestError: any;

    // Methods
    response: any;
    request: Request;

    // RequestState
    value: any;
    requestState: RequestState;
    isEmpty: boolean;
    isFetching: boolean;
    isRefetching: boolean;
    isSuccess: boolean;
    isError: boolean;

    constructor(props: MessageInput) {
        this.response = props.response;
        this.requestError = props.requestError;
        this.request = props.request;
        this.value = props.value;
        this.requestState = props.requestState || 'empty';

        // $FlowFixMe
        Object.defineProperties(this, {
            isEmpty: {
                enumerable: true,
                get: () => this.requestState === 'empty'
            },
            isFetching: {
                enumerable: true,
                get: () => this.requestState === 'fetching'
            },
            isRefetching: {
                enumerable: true,
                get: () => this.requestState === 'refetching'
            },
            isSuccess: {
                enumerable: true,
                get: () => this.requestState === 'success'
            },
            isError: {
                enumerable: true,
                get: () => this.requestState === 'error'
            }
        });
    }

    //
    // Response Getters

    get(key: string, notFoundValue?: unknown): unknown {
        const value = this.response?.[key];
        return value === undefined ? notFoundValue : value;
    }

    getIn(path: string[], notFoundValue?: unknown): unknown {
        let ii = this.response;
        for (let key of path) {
            ii = ii?.[key];
            if (ii === undefined) {
                return notFoundValue;
            }
        }
        return ii;
    }

    //
    // Updating Methods

    update(updater: Function): Message {
        return new Message(updater(this));
    }

    _createMap = (bool: string, create: Function) => {
        return (fn: Function) => {
            if (this[bool]) {
                let value = fn(this.value, this);
                return value instanceof Message ? value : create({...this, value});
            }
            return this;
        };
    };

    //
    // State Functions

    static empty = (messageLike: any = {}) =>
        new Message({
            ...messageLike,
            response: undefined,
            requestError: undefined,
            requestState: 'empty'
        });
    emptyMap = this._createMap('isEmpty', Message.empty);
    toEmpty = () => Message.empty(this);

    static fetching = (messageLike: any = {}) =>
        new Message({
            ...messageLike,
            response: undefined,
            requestError: undefined,
            requestState: 'fetching'
        });
    fetchingMap = this._createMap('isFetching', Message.fetching);
    toFetching = () => Message.fetching(this);

    static refetching = (messageLike: any = {}) =>
        new Message({
            ...messageLike,
            requestState: 'refetching'
        });
    refetchingMap = this._createMap('isRefetching', Message.refetching);
    toRefetching = () => Message.refetching(this);

    static success = (messageLike: any = {}) =>
        new Message({
            ...messageLike,
            requestError: undefined,
            requestState: 'success'
        });
    successMap = this._createMap('isSuccess', Message.success);
    toSuccess = () => Message.success(this);

    static error = (messageLike: any = {}) =>
        new Message({
            ...messageLike,
            requestState: 'error'
        });
    errorMap = this._createMap('isError', Message.error);
    toError = () => Message.error(this);
}

import RequestState from './RequestState';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';

type MessageShape<R> = {
    response: R;
    requestError?: Error;
    request: <A, B>(payload: A, meta: B) => void;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    requestState?: RequestState;
};

export default class Message<Res> {
    response: Res;
    requestError?: Error;
    request: <A, B>(payload?: A, meta?: B) => void;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    requestState: RequestState;

    constructor(props: MessageShape<Res>) {
        this.responseKey = props.responseKey;
        this.response = props.response;
        this.requestState = props.requestState || RequestState.empty();
        this.requestError = props.requestError;
        this.request = props.request;
        this.reset = props.reset;
        this.removeEntity = props.removeEntity;
    }

    //
    // Response Getters
    get(key: string, notFoundValue?: unknown): unknown {
        return get(key, notFoundValue)(this.response || {});
    }

    getIn(path: string[], notFoundValue?: unknown): unknown {
        return getIn(path, notFoundValue)(this.response || {});
    }

    //
    // Updating Methods
    update<RR>(updater: (message: Message<Res>) => MessageShape<RR>): Message<RR> {
        return new Message(updater(this));
    }

    updateRequestState<A>(
        updater: (requestState: RequestState) => RequestState,
        messageProps?: Partial<MessageShape<A>>
    ) {
        return new Message({
            ...this,
            ...(messageProps || {}),
            requestState: updater(this.requestState)
        });
    }

    //
    // empty
    static empty(messageProps: MessageShape<undefined>) {
        return new Message({
            ...messageProps,
            response: undefined,
            requestError: undefined,
            requestState: RequestState.empty()
        });
    }
    toEmpty(): Message<Res> {
        return this.updateRequestState((_) => _.toEmpty());
    }

    //
    // fetching
    static fetching(messageProps: MessageShape<undefined>): Message<undefined> {
        return new Message({
            ...messageProps,
            response: undefined,
            requestState: RequestState.fetching()
        });
    }
    toFetching() {
        return this.updateRequestState((_) => _.toFetching());
    }

    //
    // refetching
    static refetching<RR>(messageProps: MessageShape<RR>): Message<RR> {
        return new Message({
            ...messageProps,
            requestState: RequestState.refetching()
        });
    }
    toRefetching() {
        return this.updateRequestState((_) => _.toRefetching());
    }

    //
    // success
    static success<RR>(messageProps: MessageShape<RR>): Message<RR> {
        return new Message({
            ...messageProps,
            requestState: RequestState.success()
        });
    }
    toSuccess() {
        return this.updateRequestState((_) => _.toSuccess());
    }

    //
    // Error
    static error<RR>(messageProps: MessageShape<RR>): Message<RR> {
        return new Message({
            ...messageProps,
            requestState: RequestState.error()
        });
    }
    toError() {
        return this.updateRequestState((_) => _.toError());
    }
}

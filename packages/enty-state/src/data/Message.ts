import RequestState from '../data/RequestState';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';

type MessageShape<R, E> = {
    response: R;
    requestError: E;
    request: <A, B>(payload: A, meta: B) => void;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    requestState?: RequestState;
};

export default class Message<Res, Err> {
    response: Res;
    requestError: Err;
    request: <A, B>(payload?: A, meta?: B) => void;
    reset: () => void;
    removeEntity: (type: string, id: string) => void;
    responseKey: string;
    requestState: RequestState;

    constructor(props: MessageShape<Res, Err>) {
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
    update<RR, EE>(updater: (message: Message<Res, Err>) => MessageShape<RR, EE>): Message<RR, EE> {
        return new Message(updater(this));
    }

    updateRequestState<A, B>(
        updater: (requestState: RequestState) => RequestState,
        messageProps?: Partial<MessageShape<A, B>>
    ) {
        return new Message({
            ...this,
            ...(messageProps || {}),
            requestState: updater(this.requestState)
        });
    }

    //
    // empty
    static empty(messageProps: MessageShape<undefined, undefined>) {
        return new Message({
            ...messageProps,
            response: undefined,
            requestError: undefined,
            requestState: RequestState.empty()
        });
    }
    toEmpty(): Message<Res, Err> {
        return this.updateRequestState((_) => _.toEmpty());
    }

    //
    // fetching
    static fetching<EE>(messageProps: MessageShape<undefined, EE>): Message<undefined, EE> {
        return new Message({
            ...(messageProps || {}),
            response: undefined,
            requestState: RequestState.fetching()
        });
    }
    toFetching() {
        return this.updateRequestState((_) => _.toFetching());
    }

    //
    // refetching
    static refetching<RR, EE>(messageProps: MessageShape<RR, EE>): Message<RR, EE> {
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
    static success<RR, EE>(messageProps: MessageShape<RR, EE>): Message<RR, EE> {
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
    static error<RR, EE>(messageProps: MessageShape<RR, EE>): Message<RR, EE> {
        return new Message({
            ...messageProps,
            requestState: RequestState.error()
        });
    }
    toError() {
        return this.updateRequestState((_) => _.toError());
    }
}

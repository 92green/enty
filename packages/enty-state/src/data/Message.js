// @flow
import RequestState from '../data/RequestState';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';


type MessageInput<R, E> = {
    response: R,
    requestError: E,
    onRequest: (response: mixed) => Promise<mixed>,
    requestState?: RequestState,
    responseKey: string
};

export default class Message<R, E> {

    response: R;
    requestError: E;
    onRequest: (response: mixed) => Promise<mixed>;
    responseKey: string;
    requestState: RequestState;

    constructor(props: MessageInput<R, E>) {
        this.responseKey = props.responseKey;
        this.response = props.response;
        this.requestState = props.requestState || RequestState.empty();
        this.requestError = props.requestError;
        this.onRequest = props.onRequest;
    }


    //
    // Response Getters

    get(key: string, notFoundValue: mixed): mixed {
        return get(key, notFoundValue)(this.response || {});
    }

    getIn(path: string[], notFoundValue: mixed): mixed {
        return getIn(path, notFoundValue)(this.response || {});
    }


    //
    // Updating Methods

    update(updater: Function): Message<R, E> {
        return new Message(updater(this));
    }

    updateRequestState(updater: Function, messageProps?: MessageInput<R, E> = {}): Message<R, E> {
        return new Message({
            ...messageProps,
            requestState: updater(this.requestState)
        });
    }


    //
    // empty

    static empty(messageProps: MessageInput<R, E>): Message<R, E> {
        return new Message({
            ...messageProps,
            response: undefined,
            requestError: undefined,
            requestState: RequestState.empty()
        });
    }
    toEmpty(): Message<R, E> {
        return this.updateRequestState(_ => _.toEmpty(), {...this});
    }


    //
    // fetching

    static fetching(messageProps?: MessageInput<R, E> = {}): Message<R, E> {
        return new Message({
            ...messageProps,
            response: undefined,
            requestState: RequestState.fetching()
        });
    }
    toFetching(): Message<R, E> {
        return this.updateRequestState(_ => _.toFetching(), {...this});
    }


    //
    // refetching

    static refetching(response: R, messageProps?: MessageInput<R, E> = {}): Message<R, E> {
        return new Message({
            ...messageProps,
            response,
            requestState: RequestState.refetching()
        });
    }
    toRefetching(response?: R): Message<R, E> {
        return this.updateRequestState(_ => _.toRefetching(), {...this, response});
    }


    //
    // success

    static success(response: R, messageProps?: MessageInput<R, E> = {}): Message<R, E> {
        return new Message({
            ...messageProps,
            response,
            requestState: RequestState.success()
        });
    }
    toSuccess(response?: R): Message<R, E> {
        return this.updateRequestState(_ => _.toSuccess(), {...this, response});
    }



    //
    // Error

    static error(requestError: E, messageProps?: MessageInput<R, E> = {}): Message<R, E> {
        return new Message({
            ...messageProps,
            requestError,
            requestState: RequestState.error()
        });
    }
    toError(requestError: E): Message<R, E> {
        return this.updateRequestState(_ => _.toError(), {...this, requestError});
    }
}


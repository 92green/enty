// @flow

import RequestState from '../data/RequestState';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';


type MessageProps = {
    responseKey?: ?string,
    response?: any,
    requestState?: RequestState,
    requestError?: any,
    onRequest?: (response: mixed) => Promise<mixed>
};

export default class Message {

    onRequest: (response: mixed) => Promise<mixed>;
    requestState: RequestState;
    response: mixed;
    requestError: mixed;
    responseKey: ?string;

    constructor(props: MessageProps = {}) {
        this.responseKey = props.responseKey;
        this.response = props.response;
        this.requestState = props.requestState || RequestState.empty();
        this.requestError = props.requestError;
        this.onRequest = props.onRequest || Promise.resolve;
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

    update(updater: Function): Message {
        return new Message(updater(this));
    }

    updateRequestState(updater: Function, messageProps?: MessageProps = {}): Message {
        return new Message({
            ...this,
            ...messageProps,
            requestState: updater(this.requestState)
        });
    }


    //
    // empty

    static empty(messageProps?: MessageProps = {}): Message {
        return new Message({
            ...messageProps,
            requestState: RequestState.empty()
        });
    }
    toEmpty(): Message {
        return this.updateRequestState(_ => _.toEmpty());
    }


    //
    // fetching

    static fetching(messageProps?: MessageProps = {}): Message {
        return new Message({
            ...messageProps,
            requestState: RequestState.fetching()
        });
    }
    toFetching(): Message {
        return this.updateRequestState(_ => _.toFetching());
    }


    //
    // refetching

    static refetching(response: mixed, messageProps?: MessageProps = {}): Message {
        return new Message({
            ...messageProps,
            response,
            requestState: RequestState.refetching()
        });
    }
    toRefetching(response?: mixed): Message {
        return this.updateRequestState(_ => _.toRefetching(), {response});
    }


    //
    // success

    static success(response: mixed, messageProps?: MessageProps = {}): Message {
        return new Message({
            ...messageProps,
            response,
            requestState: RequestState.success()
        });
    }
    toSuccess(response?: mixed): Message {
        return this.updateRequestState(_ => _.toSuccess(), {response});
    }


    //
    // Error

    static error(requestError: mixed, messageProps?: MessageProps = {}): Message {
        return new Message({
            ...messageProps,
            requestError,
            requestState: RequestState.error()
        });
    }
    toError(requestError?: mixed): Message {
        return this.updateRequestState(_ => _.toError(), {requestError});
    }
}


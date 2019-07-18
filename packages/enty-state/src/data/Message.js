// @flow
import type {RequestState} from '../data/RequestState';

import {EmptyState} from '../data/RequestState';
import {FetchingState} from '../data/RequestState';
import {RefetchingState} from '../data/RequestState';
import {SuccessState} from '../data/RequestState';
import {ErrorState} from '../data/RequestState';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';


type MessageProps = {
    responseKey?: ?string,
    response?: any,
    requestState?: RequestState,
    requestError?: any,
    onRequest?: ?(response: mixed) => Promise<mixed>
};

export default class Message {

    onRequest: ?(response: mixed) => Promise<mixed>;
    requestState: RequestState;
    response: mixed;
    requestError: mixed;
    responseKey: ?string;

    constructor(props: MessageProps = {}) {
        this.responseKey = props.responseKey;
        this.response = props.response;
        this.requestState = props.requestState || EmptyState();
        this.requestError = props.requestError;
        this.onRequest = props.onRequest;
    }


    //
    // Response Getters

    get(key: string, notFoundValue: mixed): mixed {
        return get(key, notFoundValue)(this.response);
    }

    getIn(path: string[], notFoundValue: mixed): mixed {
        return getIn(path, notFoundValue)(this.response);
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

    toEmpty(): Message {
        return this.updateRequestState(_ => _.toEmpty());
    }

    toFetching(): Message {
        return this.updateRequestState(_ => _.toFetching());
    }

    toRefetching(response?: mixed): Message {
        return this.updateRequestState(_ => _.toRefetching(), {response});
    }

    toSuccess(response?: mixed): Message {
        return this.updateRequestState(_ => _.toSuccess(), {response});
    }

    toError(requestError?: mixed): Message {
        return this.updateRequestState(_ => _.toError(), {requestError});
    }
}



//
// Constructors

export const EmptyMessage = (messageProps?: MessageProps = {}) => new Message({
    ...messageProps,
    requestState: EmptyState()
});

export const FetchingMessage = (messageProps?: MessageProps = {}) => new Message({
    ...messageProps,
    requestState: FetchingState()
});

export const RefetchingMessage = (response: mixed, messageProps?: MessageProps = {}) => new Message({
    ...messageProps,
    response,
    requestState: RefetchingState()
});

export const SuccessMessage = (response: mixed, messageProps?: MessageProps = {}) => new Message({
    ...messageProps,
    response,
    requestState: SuccessState()
});

export const ErrorMessage = (requestError: mixed, messageProps?: MessageProps = {}) => new Message({
    ...messageProps,
    requestError,
    requestState: ErrorState()
});


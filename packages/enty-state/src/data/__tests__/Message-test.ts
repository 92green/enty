import {describe, expect, it} from '@jest/globals';
import Message from '../Message';
import RequestState from '../../data/RequestState';

const response = {name: 'foo'};
const responseKey = 'FOO';
const request = async () => response;
const requestError = 'ERROR!';
const reset = () => {};
const removeEntity = () => {};

const messageInput = {
    response,
    responseKey,
    request,
    requestError,
    reset,
    removeEntity
};

const emptyMessageInput = {
    response: undefined,
    requestError: undefined,
    responseKey,
    request,
    reset,
    removeEntity
};

it('will let you set responseKey, response, requestState, requestError, request', () => {
    const message = new Message({
        reset,
        responseKey: 'foo',
        response: 'bar',
        requestState: RequestState.success('baz'),
        requestError: 'qux',
        removeEntity,
        request: () => Promise.resolve('quux')
    });

    expect(message.responseKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestState.value()).toBe('baz');
    expect(message.requestError).toBe('qux');
    expect(message.request()).resolves.toBe('quux');
});

it('will default requestState to Empty', () => {
    expect(
        new Message({
            reset,
            removeEntity,
            response: null,
            responseKey: 'foo',
            request: Promise.resolve,
            requestError: null
        }).requestState.isEmpty
    ).toBe(true);
});

it('will let you update the message', () => {
    const newMessage = Message.empty(emptyMessageInput).update((message) => ({
        ...message,
        response: 'bar'
    }));

    expect(newMessage.response).toBe('bar');
});

describe('Message response methods', () => {
    const message = Message.success({
        ...messageInput,
        response: {
            foo: 'bar',
            bar: {
                baz: 'qux'
            }
        }
    });

    it('will select a value from the response', () => {
        expect(message.get('foo')).toBe('bar');
        expect(message.getIn(['bar', 'baz'])).toBe('qux');
    });

    it('will use not found value if nothing is found', () => {
        expect(message.get('blah', '!')).toBe('!');
        expect(message.getIn(['bar', 'blah'], '!')).toBe('!');
    });

    it('will not break on empty responses', () => {
        expect(Message.empty(emptyMessageInput).get('blah', '!')).toBe('!');
        expect(Message.empty(emptyMessageInput).getIn(['bar', 'blah'], '!')).toBe('!');
    });
});

describe('Message requestState methods', () => {
    const message = Message.success(messageInput);

    it('Message.updateRequestState can replace the requestState', () => {
        const errorMessage = message.updateRequestState(RequestState.error);
        expect(errorMessage.requestState.isError).toBe(true);
    });

    it('Message.updateRequestState is given the current requestState', () => {
        const errorMessage = message.updateRequestState((requestState) =>
            requestState.successFlatMap(RequestState.error)
        );

        expect(errorMessage.requestState.isError).toBe(true);
        expect(errorMessage.requestState.isSuccess).not.toBe(true);
    });

    it('will change requestState with .to functions', () => {
        const emptyMessage = Message.empty(emptyMessageInput);
        const fetchingMessage = Message.fetching({...messageInput, response: undefined});
        expect(fetchingMessage.toEmpty().requestState.isEmpty).toBe(true);
        expect(emptyMessage.toFetching().requestState.isFetching).toBe(true);
        expect(emptyMessage.toRefetching().requestState.isRefetching).toBe(true);
        expect(emptyMessage.toSuccess().requestState.isSuccess).toBe(true);
        expect(emptyMessage.toError().requestState.isError).toBe(true);
    });
});

describe('Message Constructors', () => {
    it('Message.empty will create a empty message without a response', () => {
        const message = Message.empty(emptyMessageInput);
        expect(message.response).toBeUndefined();
        expect(message.requestState.isEmpty).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('Message.fetching will create a fetching message without a response', () => {
        const message = Message.fetching({...messageInput, response: undefined});
        expect(message.response).toBeUndefined();
        expect(message.requestState.isFetching).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('Message.refetching will create a refetching message with a response', () => {
        const message = Message.refetching(messageInput);
        expect(message.response).toBe(response);
        expect(message.requestState.isRefetching).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('Message.success will create a success message with a response', () => {
        const message = Message.success(messageInput);
        expect(message.response).toBe(response);
        expect(message.requestState.isSuccess).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('Message.error will create a error message with requestError', () => {
        const message = Message.error(messageInput);
        expect(message.requestError).toBe(requestError);
        expect(message.requestState.isError).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('will not break if nothing is passed to each constructor', () => {
        expect(Message.empty).not.toThrow();
        expect(Message.fetching).not.toThrow();
        expect(Message.refetching).not.toThrow();
        expect(Message.success).not.toThrow();
        expect(Message.error).not.toThrow();
    });
});

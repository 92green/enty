import {MessageFactory} from '../Message';

const response = {name: 'foo'};
const responseKey = 'FOO';
const request: any = () => {};
const requestError = new Error('ERROR!');
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

it('will let you set responseKey, response, requestState, requestError, request', () => {
    const message = MessageFactory.success({
        reset,
        responseKey: 'foo',
        response: 'bar',
        requestError: new Error('qux'),
        removeEntity,
        request
    });

    expect(message.responseKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestError).toEqual(new Error('qux'));
});

it('will default requestState to Empty', () => {
    const message = MessageFactory.empty({
        reset,
        removeEntity,
        response: undefined,
        responseKey: 'foo',
        request: Promise.resolve,
        requestError: undefined
    });
    expect(message.requestState.isEmpty).toBe(true);
});

describe('Message Constructors', () => {
    test('Message.empty will create a empty message without a response', () => {
        const message = MessageFactory.empty(messageInput);
        expect(message.response).toBeUndefined();
        expect(message.requestState.isEmpty).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    test('Message.fetching will create a fetching message without a response', () => {
        const message = MessageFactory.fetching(messageInput);
        expect(message.response).toBeUndefined();
        expect(message.requestState.isFetching).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    test('Message.refetching will create a refetching message with a response', () => {
        const message = MessageFactory.refetching(messageInput);
        expect(message.response).toBe(response);
        expect(message.requestState.isRefetching).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    test('Message.success will create a success message with a response', () => {
        const message = MessageFactory.success(messageInput);
        expect(message.response).toBe(response);
        expect(message.requestState.isSuccess).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    test('Message.error will create a error message with requestError', () => {
        const message = MessageFactory.error(messageInput);
        expect(message.requestError).toBe(requestError);
        expect(message.requestState.isError).toBe(true);
        expect(message.responseKey).toBe('FOO');
    });

    it('will not break if nothing is passed to each constructor', () => {
        expect(MessageFactory.empty).not.toThrow();
        expect(MessageFactory.fetching).not.toThrow();
        expect(MessageFactory.refetching).not.toThrow();
        expect(MessageFactory.success).not.toThrow();
        expect(MessageFactory.error).not.toThrow();
    });
});

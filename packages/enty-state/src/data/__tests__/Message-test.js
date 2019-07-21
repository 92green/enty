// @flow
import Message from '../Message';
import RequestState from '../../data/RequestState';

test('will let you set responseKey, response, requestState, requestError, onRequest', () => {
    const message = new Message({
        responseKey: 'foo',
        response: 'bar',
        requestState: RequestState.success('baz'),
        requestError: 'qux',
        onRequest: () => Promise.resolve('quux')
    });

    expect(message.responseKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestState.value()).toBe('baz');
    expect(message.requestError).toBe('qux');
    expect(message.onRequest()).resolves.toBe('quux');
});


test('will default requestState to Empty', () => {
    expect(new Message().requestState.isEmpty).toBe(true);
});

describe('Message response methods', () => {
    const message = Message.success({
        foo: 'bar',
        bar: {
            baz: 'qux'
        }
    });

    test('Message.get will select a value from the response', () => {
        expect(message.get('foo')).toBe('bar');
    });

    test('Message.getIn will select a deep value from the response', () => {
        expect(message.getIn(['bar', 'baz'])).toBe('qux');
    });

});

describe('Message requestState methods', () => {
    const message = Message.success({foo: 'foo'});

    test('Message.updateRequestState can replace the requestState', () => {
        const errorMessage = message.updateRequestState(RequestState.error);
        expect(errorMessage.requestState.isError).toBe(true);
    });

    test('Message.updateRequestState is given the current requestState', () => {
        const errorMessage = message
            .updateRequestState(requestState => requestState.successFlatMap(RequestState.error));

        expect(errorMessage.requestState.isError).toBe(true);
        expect(errorMessage.requestState.isSuccess).not.toBe(true);
    });

});

describe('Message Constructors', () => {
    test('Message.empty will create a empty message without a response', () => {
        const message = Message.empty({responseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.isEmpty).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('Message.fetching will create a fetching message without a response', () => {
        const message = Message.fetching({responseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.isFetching).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('Message.refetching will create a refetching message with a response', () => {
        const message = Message.refetching('foo', {responseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.isRefetching).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('Message.success will create a success message with a response', () => {
        const message = Message.success('foo', {responseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.isSuccess).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('Message.error will create a error message with requestError', () => {
        const message = Message.error('foo', {responseKey: 'bar'});
        expect(message.requestError).toBe('foo');
        expect(message.requestState.isError).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    it('will not break if nothing is passed to each constructor', () => {
        expect(Message.empty).not.toThrow();
        expect(Message.fetching).not.toThrow();
        expect(Message.refetching).not.toThrow();
        expect(Message.success).not.toThrow();
        expect(Message.error).not.toThrow();
    });
});


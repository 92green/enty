// @flow
import Message from '../Message';
import {EmptyMessage} from '../Message';
import {FetchingMessage} from '../Message';
import {RefetchingMessage} from '../Message';
import {SuccessMessage} from '../Message';
import {ErrorMessage} from '../Message';
import {ErrorState} from '../../data/RequestState';

test('will let you set responseKey, response, requestState, requestError, onRequest', () => {
    const message = new Message({
        responseKey: 'foo',
        response: 'bar',
        requestState: 'baz',
        requestError: 'qux',
        onRequest: 'quux'
    });

    expect(message.responseKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestState).toBe('baz');
    expect(message.requestError).toBe('qux');
    expect(message.onRequest).toBe('quux');
});


test('will default requestState to Empty', () => {
    expect(new Message().requestState.isEmpty).toBe(true);
});

describe('Message response methods', () => {
    const message = SuccessMessage({
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
    const message = SuccessMessage({foo: 'foo'});

    test('Message.updateRequestState can replace the requestState', () => {
        const errorMessage = message.updateRequestState(ErrorState);
        expect(errorMessage.requestState.isError).toBe(true);
    });

    test('Message.updateRequestState is given the current requestState', () => {
        const errorMessage = message
            .updateRequestState(requestState => requestState.successFlatMap(ErrorState));

        expect(errorMessage.requestState.isError).toBe(true);
        expect(errorMessage.requestState.isSuccess).not.toBe(true);
    });

});

describe('Message Constructors', () => {
    test('EmptyMessage will create a empty message without a response', () => {
        const message = EmptyMessage({responseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.isEmpty).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('FetchingMessage will create a fetching message without a response', () => {
        const message = FetchingMessage({responseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.isFetching).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('RefetchingMessage will create a refetching message with a response', () => {
        const message = RefetchingMessage('foo', {responseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.isRefetching).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('SuccessMessage will create a success message with a response', () => {
        const message = SuccessMessage('foo', {responseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.isSuccess).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    test('ErrorMessage will create a error message with requestError', () => {
        const message = ErrorMessage('foo', {responseKey: 'bar'});
        expect(message.requestError).toBe('foo');
        expect(message.requestState.isError).toBe(true);
        expect(message.responseKey).toBe('bar');
    });

    it('will not break if nothing is passed to each constructor', () => {
        expect(EmptyMessage).not.toThrow();
        expect(FetchingMessage).not.toThrow();
        expect(RefetchingMessage).not.toThrow();
        expect(SuccessMessage).not.toThrow();
        expect(ErrorMessage).not.toThrow();
    });
});


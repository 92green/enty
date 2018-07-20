//@flow
//
import Message from '../Message';
import {EmptyMessage} from '../Message';
import {FetchingMessage} from '../Message';
import {RefetchingMessage} from '../Message';
import {SuccessMessage} from '../Message';
import {ErrorMessage} from '../Message';

test('will let you set resultKey, response, requestState, requestError, onRequest', () => {
    const message = new Message({
        resultKey: 'foo',
        response: 'bar',
        requestState: 'baz',
        requestError: 'qux',
        onRequest: 'quux',
    });

    expect(message.resultKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestState).toBe('baz');
    expect(message.requestError).toBe('qux');
    expect(message.onRequest).toBe('quux');
});


test('will default requestState to Empty', () => {
    expect(new Message().requestState.isEmpty).toBe(true);
});

test('EmptyMessage will create a empty message without a response', () => {
    const message = EmptyMessage({resultKey: 'bar'});
    expect(message.response).toBeUndefined();
    expect(message.requestState.isEmpty).toBe(true);
    expect(message.resultKey).toBe('bar');
});

test('FetchingMessage will create a fetching message without a response', () => {
    const message = FetchingMessage({resultKey: 'bar'});
    expect(message.response).toBeUndefined();
    expect(message.requestState.isFetching).toBe(true);
    expect(message.resultKey).toBe('bar');
});

test('RefetchingMessage will create a refetching message with a response', () => {
    const message = RefetchingMessage('foo', {resultKey: 'bar'});
    expect(message.response).toBe('foo');
    expect(message.requestState.isRefetching).toBe(true);
    expect(message.resultKey).toBe('bar');
});

test('SuccessMessage will create a success message with a response', () => {
    const message = SuccessMessage('foo', {resultKey: 'bar'});
    expect(message.response).toBe('foo');
    expect(message.requestState.isSuccess).toBe(true);
    expect(message.resultKey).toBe('bar');
});

test('ErrorMessage will create a error message with requestError', () => {
    const message = ErrorMessage('foo', {resultKey: 'bar'});
    expect(message.requestError).toBe('foo');
    expect(message.requestState.isError).toBe(true);
    expect(message.resultKey).toBe('bar');
});

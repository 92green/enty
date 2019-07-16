// @flow
import Message from '../Message';
import {EmptyMessage} from '../Message';
import {FetchingMessage} from '../Message';
import {RefetchingMessage} from '../Message';
import {SuccessMessage} from '../Message';
import {ErrorMessage} from '../Message';
import {ErrorState} from '../../data/RequestState';

test('will let you set reponseKey, response, requestState, requestError, onRequest', () => {
    const message = new Message({
        reponseKey: 'foo',
        response: 'bar',
        requestState: 'baz',
        requestError: 'qux',
        onRequest: 'quux'
    });

    expect(message.reponseKey).toBe('foo');
    expect(message.response).toBe('bar');
    expect(message.requestState).toBe('baz');
    expect(message.requestError).toBe('qux');
    expect(message.onRequest).toBe('quux');
});


test('will default requestState to Empty', () => {
    expect(new Message().requestState.type).toBe('Empty');
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
        expect(errorMessage.requestState.type).toBe('Error');
    });

    test('Message.updateRequestState is given the current requestState', () => {
        const errorMessage = message
            .updateRequestState(requestState => requestState.successFlatMap(ErrorState));

        expect(errorMessage.requestState.type).toBe('Error');
        expect(errorMessage.requestState.type).not.toBe('Success');
    });

});

describe('Message Constructors', () => {
    test('EmptyMessage will create a empty message without a response', () => {
        const message = EmptyMessage({reponseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.type).toBe('Empty');
        expect(message.reponseKey).toBe('bar');
    });

    test('FetchingMessage will create a fetching message without a response', () => {
        const message = FetchingMessage({reponseKey: 'bar'});
        expect(message.response).toBeUndefined();
        expect(message.requestState.type).toBe('Fetching');
        expect(message.reponseKey).toBe('bar');
    });

    test('RefetchingMessage will create a refetching message with a response', () => {
        const message = RefetchingMessage('foo', {reponseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.type).toBe('Refetching');
        expect(message.reponseKey).toBe('bar');
    });

    test('SuccessMessage will create a success message with a response', () => {
        const message = SuccessMessage('foo', {reponseKey: 'bar'});
        expect(message.response).toBe('foo');
        expect(message.requestState.type).toBe('Success');
        expect(message.reponseKey).toBe('bar');
    });

    test('ErrorMessage will create a error message with requestError', () => {
        const message = ErrorMessage('foo', {reponseKey: 'bar'});
        expect(message.requestError).toBe('foo');
        expect(message.requestState.type).toBe('Error');
        expect(message.reponseKey).toBe('bar');
    });

    it('will not break if nothing is passed to each constructor', () => {
        expect(EmptyMessage).not.toThrow();
        expect(FetchingMessage).not.toThrow();
        expect(RefetchingMessage).not.toThrow();
        expect(SuccessMessage).not.toThrow();
        expect(ErrorMessage).not.toThrow();
    });
});


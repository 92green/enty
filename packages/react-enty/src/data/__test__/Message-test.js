//@flow
//
import Message from '../Message';

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

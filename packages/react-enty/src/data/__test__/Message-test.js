//@flow
//
import test from 'ava';

import Message from '../Message';

test('will let you set resultKey, response, requestState, requestError, onRequest', (t: Object) => {
    const message = new Message({
        resultKey: 'foo',
        response: 'bar',
        requestState: 'baz',
        requestError: 'qux',
        onRequest: 'quux',
    });

    t.is(message.resultKey, 'foo');
    t.is(message.response, 'bar');
    t.is(message.requestState, 'baz');
    t.is(message.requestError, 'qux');
    t.is(message.onRequest , 'quux');
});


test('will default requestState to Empty', (t: Object) => {
    t.is(new Message().requestState.isEmpty, true);
});

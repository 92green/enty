//@flow
//
import test from 'ava';

import {NoDefinitionError} from '../Error';

test('NoDefinitionError', (t: Object) => {
    const error = t.throws(() => {
        throw NoDefinitionError('foo');
    });
    t.is(error.message.indexOf('foo') !== -1, true);
});

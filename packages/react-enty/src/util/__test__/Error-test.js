//@flow
//
import test from 'ava';

import {NoDefinitionError} from '../Error';
import {CompositeKeysMustBeEntitiesError} from '../Error';
import {CompositeDefinitionMustBeEntityError} from '../Error';
import {UndefinedIdError} from '../Error';

test('NoDefinitionError', (t: Object) => {
    const error = t.throws(() => {
        throw NoDefinitionError('foo');
    });
    t.is(error.message.indexOf('foo') !== -1, true);
});


test('CompositeKeysMustBeEntitiesError', (t: Object) => {
    const error = t.throws(() => {
        throw CompositeKeysMustBeEntitiesError('foo', 'bar');
    });
    t.is(error.message.indexOf('foo') !== -1, true);
    t.is(error.message.indexOf('bar') !== -1, true);
});


test('CompositeDefinitionMustBeEntityError', (t: Object) => {
    const error = t.throws(() => {
        throw CompositeDefinitionMustBeEntityError('foo', 'bar');
    });
    t.is(error.message.indexOf('foo') !== -1, true);
    t.is(error.message.indexOf('bar') !== -1, true);
});

test('UndefinedIdError', (t: Object) => {
    const error = t.throws(() => {
        throw UndefinedIdError('foo', 'bar');
    });
    t.is(error.message.indexOf('foo') !== -1, true);
    t.is(error.message.indexOf('bar') !== -1, true);
});

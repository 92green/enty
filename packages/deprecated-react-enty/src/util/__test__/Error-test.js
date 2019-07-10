//@flow
//
import { NoDefinitionError } from '../Error';
import {CompositeKeysMustBeEntitiesError} from '../Error';
import {CompositeDefinitionMustBeEntityError} from '../Error';
import {UndefinedIdError} from '../Error';

test('NoDefinitionError', () => {
    const error = expect(() => {
        throw NoDefinitionError('foo');
    }).toThrow(/foo/);
});


test('CompositeKeysMustBeEntitiesError', () => {
    const error = expect(() => {
        throw CompositeKeysMustBeEntitiesError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});


test('CompositeDefinitionMustBeEntityError', () => {
    const error = expect(() => {
        throw CompositeDefinitionMustBeEntityError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

test('UndefinedIdError', () => {
    const error = expect(() => {
        throw UndefinedIdError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

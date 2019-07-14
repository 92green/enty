//@flow
import {NoDefinitionError} from '../Error';
import {CompositeKeysMustBeEntitiesError} from '../Error';
import {CompositeDefinitionMustBeEntityError} from '../Error';
import {UndefinedIdError} from '../Error';

test('NoDefinitionError', () => {
    expect(() => {
        throw NoDefinitionError('foo');
    }).toThrow(/foo/);
});


test('CompositeKeysMustBeEntitiesError', () => {
    expect(() => {
        throw CompositeKeysMustBeEntitiesError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});


test('CompositeDefinitionMustBeEntityError', () => {
    expect(() => {
        throw CompositeDefinitionMustBeEntityError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

test('UndefinedIdError', () => {
    expect(() => {
        throw UndefinedIdError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

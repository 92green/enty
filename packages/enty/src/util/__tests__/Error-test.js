//@flow
import {NoShapeError} from '../Error';
import {CompositeKeysMustBeEntitiesError} from '../Error';
import {CompositeShapeMustBeEntityError} from '../Error';
import {UndefinedIdError} from '../Error';

test('NoShapeError', () => {
    expect(() => {
        throw NoShapeError('foo');
    }).toThrow(/foo/);
});


test('CompositeKeysMustBeEntitiesError', () => {
    expect(() => {
        throw CompositeKeysMustBeEntitiesError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});


test('CompositeShapeMustBeEntityError', () => {
    expect(() => {
        throw CompositeShapeMustBeEntityError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

test('UndefinedIdError', () => {
    expect(() => {
        throw UndefinedIdError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

//@flow
import NullSchema from '../NullSchema';
import MapSchema from '../MapSchema';
import {DELETED_ENTITY} from '../util/SchemaConstant';
import {fromJS} from 'immutable';
import {NoDefinitionError} from '../util/Error';

var foo = new NullSchema();
const denormalizeState = {entities: {}, result: {}};

test('denormalize will return null', () => {
    expect(foo.denormalize(denormalizeState)).toBe(null);
});


test('denormalize does not care about path', () => {
    expect(() => foo.denormalize(denormalizeState)).not.toThrow();
    expect(() => foo.denormalize(denormalizeState, ['foo'])).not.toThrow();
});

test('normalize will return blank NormalizeState', () => {
    const state = foo.normalize('_', {foo: 'foo'});

    expect(state.entities.foo).toBe('foo');
    expect(state.result).toBe(null);
    expect(state.schemas).toEqual({});
});

test('normalize will not mutate entities', () => {
    const entities = {foo: {}};
    const state = foo.normalize('_', entities);

    expect(state.entities.foo).toBe(entities.foo);
});


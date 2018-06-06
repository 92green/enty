//@flow
import test from 'ava';
import NullSchema from '../NullSchema';
import MapSchema from '../MapSchema';
import {DELETED_ENTITY} from '../util/SchemaConstant';
import {fromJS} from 'immutable';
import {NoDefinitionError} from '../util/Error';

var foo = new NullSchema();
const denormalizeState = {entities: {}, result: {}};

test('denormalize will return null', (t: *) => {
    t.is(foo.denormalize(denormalizeState), null);
});


test('denormalize does not care about path', (t: *) => {
    t.notThrows(() => foo.denormalize(denormalizeState));
    t.notThrows(() => foo.denormalize(denormalizeState, ['foo']));
});

test('normalize will return blank NormalizeState', (t: *) => {
    const state = foo.normalize('_', {foo: 'foo'});

    t.is(state.entities.foo, 'foo');
    t.is(state.result, null);
    t.deepEqual(state.schemas, {});
});

test('normalize will not mutate entities', (t: *) => {
    const entities = {foo: {}};
    const state = foo.normalize('_', entities);

    t.is(state.entities.foo, entities.foo);
});


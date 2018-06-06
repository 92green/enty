//@flow
import test from 'ava';
import {Map} from 'immutable';
import EntitySchema from '../EntitySchema';
import MapSchema from '../MapSchema';
import ValueSchema from '../ValueSchema';

const foo = EntitySchema('foo', {
    definition: MapSchema({})
});

const fooValues = MapSchema({
    foo: ValueSchema(foo)
});



test('denormalize is almost the inverse of normalize', (tt: *) => {
    const data = {foo: '1'};
    tt.deepEqual(data.foo, fooValues.denormalize(fooValues.normalize(data)).toJS().foo.id);
});

test('normalize', (tt: *) => {
    const data = Map({id: '1'});
    const entities = {
        foo: {
            "1": data
        }
    };
    tt.true(data.equals(ValueSchema(foo).normalize('1', entities).entities.foo['1']));
    tt.true(data.equals(ValueSchema(foo).normalize('1', undefined).entities.foo['1']));
});

test('denormalize', (tt: *) => {
    const data = Map({id: '1'});
    const entities = {
        foo: {
            "1": data
        }
    };
    tt.true(data.equals(ValueSchema(foo).denormalize({result: '1', entities})));
    tt.true(data.equals(ValueSchema(foo).denormalize({result: '1', entities}, undefined)));
});


//
// Getters and Setters
//
test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = ValueSchema();
    t.is(schema.set(foo), schema);
    t.is(schema.get(), foo);
    t.is(schema.update(() => schema.definition), schema);
});

test('set will replace the definition at a key', (t: *) => {
    const schema = ValueSchema();
    schema.set(foo);
    t.is(schema.definition, foo);
});

test('get will return the definition at a key', (t: *) => {
    const schema = ValueSchema(foo);
    t.is(schema.get(), foo);
});

test('update will replace the whole definition via an updater function', (t: *) => {
    const schema = ValueSchema(foo);
    schema.update(() => foo);
    t.is(schema.definition, foo);
});

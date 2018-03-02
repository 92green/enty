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



test('ValueSchema.denormalize is almost the inverse of ValueSchema.normalize', (tt: *) => {
    const data = {foo: '1'};
    tt.deepEqual(data.foo, fooValues.denormalize(fooValues.normalize(data)).toJS().foo.id);
});

test('ValueSchema.normalize', (tt: *) => {
    const data = Map({id: '1'});
    const entities = {
        foo: {
            "1": data
        }
    };
    tt.true(data.equals(ValueSchema(foo).normalize('1', entities).entities.foo['1']));
    tt.true(data.equals(ValueSchema(foo).normalize('1', undefined).entities.foo['1']));
});

test('ValueSchema.denormalize', (tt: *) => {
    const data = Map({id: '1'});
    const entities = {
        foo: {
            "1": data
        }
    };
    tt.true(data.equals(ValueSchema(foo).denormalize({result: '1', entities})));
    tt.true(data.equals(ValueSchema(foo).denormalize({result: '1', entities}, undefined)));
});


test('ValueSchema can set definition through the `define` method', (tt: *) => {
    const schema = ValueSchema();
    schema.define(foo);

    tt.is(schema.options.definition.name, 'foo');
});


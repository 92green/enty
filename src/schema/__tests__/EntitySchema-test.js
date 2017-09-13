//@flow
import test from 'ava';
import {EntitySchema, ObjectSchema} from '../../index';
import {DELETED_ENTITY} from '../SchemaConstant';
import {fromJS} from 'immutable';

var foo = EntitySchema('foo');
var bar = EntitySchema('bar');
var baz = EntitySchema('baz');

baz.define(ObjectSchema({bar}));
bar.define(ObjectSchema({foo}));

test('EntitySchema can define definition through the `define` method', (tt: Object) => {
    var schema = EntitySchema('foo');
    schema.define(ObjectSchema({bar: "1"}));
    tt.is(schema.options.definition.type, 'object');
});


test('EntitySchema can normalize entities', (tt: Object) => {
    const {entities, result} = foo.normalize({id: "1"});
    tt.is(result, "1");
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('EntitySchema can denormalize entities', (tt: Object) => {
    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        foo.denormalize({result: "1", entities}).toJS(),
        {id: "1"}
    );
});

test('EntitySchema will not cause an infinite recursion', (tt: Object) => {
    const foo = EntitySchema('foo');
    const bar = EntitySchema('bar');

    foo.define(ObjectSchema({bar}));
    bar.define(ObjectSchema({foo}));

    const entities = fromJS({
        bar: {"1": {id: "1", foo: "1"}},
        foo: {"1": {id: "1", bar: "1"}}
    });

    tt.deepEqual(
        bar.denormalize({result: "1", entities}).toJS(),
        {
            id: "1",
            foo: {
                id: "1",
                bar: {
                    id: "1",
                    foo: "1"
                }
            }
        }
    );
});

test('EntitySchema will not denormalize null entities', (tt: Object) => {
    const schema = EntitySchema('bar');

    const entities = fromJS({
        bar: {"1": {id: "1", foo: null}}
    });

    tt.deepEqual(
        schema.denormalize({result: "2", entities}),
        undefined
    );
});


test('EntitySchema will return DELETED_ENTITY placeholder if denormalizeFilter fails', (tt: Object) => {
    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    tt.deepEqual(
        foo.denormalize({result: "1", entities}),
        DELETED_ENTITY
    );
});


test('EntitySchema will not mutate input objects', (tt: Object) => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: "1"});
});


test('EntitySchema can construct objects', (tt: Object) => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: "1"});
});


test('EntitySchema will collect schemas that were used', (tt: Object) => {
    const entityTest = {id: '1', bar: {id: '2', foo: {id: '3'}}};
    tt.deepEqual(Object.keys(baz.normalize(entityTest, baz).schemas), ['foo', 'bar', 'baz']);
});




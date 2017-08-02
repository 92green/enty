import test from 'ava';
import {EntitySchema, ObjectSchema} from '../../index';
import {DELETED_ENTITY} from '../SchemaConstant';
import {fromJS} from 'immutable';

var foo = EntitySchema('foo');

test('EntitySchema can define definition through the `define` method', tt => {
    var schema = EntitySchema('foo');
    schema.define(ObjectSchema({bar: "1"}));
    tt.is(schema.options.definition.type, 'object');
});


test('EntitySchema can normalize entities', tt => {
    const {entities, result} = foo.normalize({id: "1"});
    tt.is(result, "1");
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('EntitySchema can denormalize entities', tt => {
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

test('EntitySchema will not cause an infinite recursion', tt => {
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

test('EntitySchema will not denormalize null entities', tt => {
    const schema = EntitySchema('bar');

    const entities = fromJS({
        bar: {"1": {id: "1", foo: null}}
    });

    tt.deepEqual(
        schema.denormalize({result: "2", entities}),
        undefined
    );
});


test('EntitySchema will return DELETED_ENTITY placeholder if denormalizeFilter fails', tt => {
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


test('EntitySchema will not mutate input objects', tt => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: "1"});
});


test('EntitySchema can construct objects', tt => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: "1"});
});




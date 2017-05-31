import test from 'ava';
import {EntitySchema} from '../../index';
import {DELETED_ENTITY} from '../SchemaConstant';
import {fromJS} from 'immutable';

var foo = EntitySchema('foo');

test('EntitySchema can defineChildren through the `define` method', tt => {
    var schema = EntitySchema('foo');
    schema.define({bar: 1});
    tt.is(schema.children.bar, 1);
});


test('EntitySchema can normalize entities', tt => {
    tt.deepEqual(
        foo.normalize({id: 1}, foo),
        {
            entities: {
                foo: {
                    "1": {id: 1}
                }
            },
            result: 1
        }
    );
});

test('EntitySchema can normalize entities children', tt => {
    const schema = EntitySchema('bar', {foo});
    tt.deepEqual(
        schema.normalize({id: 1, foo: {id: 1}}, schema),
        {
            entities: {
                bar: {"1": {id: 1, foo: 1}},
                foo: {"1": {id: 1}}
            },
            result: 1
        }
    );

    // null values are ignored
    tt.deepEqual(
        schema.normalize({id: 1, foo: null}, schema),
        {
            entities: {
                bar: {"1": {id: 1, foo: null}}
            },
            result: 1
        }
    );
});

test('EntitySchema can denormalize entities', tt => {
    const entities = fromJS({
        foo: {
            "1": {id: 1}
        }
    });

    tt.deepEqual(
        foo.denormalize("1", foo, entities).toJS(),
        {id: 1}
    );
});


test('EntitySchema can denormalize entities children', tt => {
    const schema = EntitySchema('bar', {foo});
    const entities = fromJS({
        bar: {"1": {id: "1", foo: "1"}},
        foo: {"1": {id: "1"}}
    });

    tt.deepEqual(
        schema.denormalize("1", schema, entities).toJS(),
        {id: "1", foo: {id: "1"}}
    );
});

test('EntitySchema will not cause an infinite recursion', tt => {
    const bar = EntitySchema('bar', {foo});
    foo.define({bar});

    const entities = fromJS({
        bar: {"1": {id: "1", foo: "1"}},
        foo: {"1": {id: "1", bar: "1"}}
    });

    tt.deepEqual(
        bar.denormalize("1", bar, entities).toJS(),
        {id: "1", foo: {id: "1", bar: {id: "1", foo: "1"}}}
    );
});

test('EntitySchema will not denormalize null children', tt => {
    const schema = EntitySchema('bar', {foo});

    const entities = fromJS({
        bar: {"1": {id: "1", foo: null}}
    });

    tt.deepEqual(
        schema.denormalize("1", schema, entities).toJS(),
        {id: "1", foo: null}
    );
});


test('EntitySchema will return DELETED_ENTITY placeholder if denormalizeFilter fails', tt => {
    const entities = fromJS({
        foo: {
            "1": {id: 1, deleted: true}
        }
    });

    tt.deepEqual(
        foo.denormalize("1", foo, entities),
        DELETED_ENTITY
    );
});


test('EntitySchema will not mutate input objects', tt => {
    const entityTest = {id: 1};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: 1});
});



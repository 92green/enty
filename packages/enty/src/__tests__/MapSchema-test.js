//@flow
import test from 'ava';
import EntitySchema from '../EntitySchema';
import MapSchema from '../MapSchema';
import {fromJS, Map} from 'immutable';

var foo = EntitySchema('foo').set(MapSchema());
var bar = EntitySchema('bar').set(MapSchema());

test('MapSchema can normalize objects', (tt: *) => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    tt.deepEqual(result.toJS(), {foo: "1"});
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('MapSchema can normalize maps', (tt: *) => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize(Map({foo: {id: "1"}}));

    tt.deepEqual(result.toJS(), {foo: "1"});
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('MapSchema.denormalize is the inverse of MapSchema.normalize', (tt: *) => {
    const schema = MapSchema({foo});
    const data = Map({foo: Map({id: "1"})});
    const output = schema.denormalize(schema.normalize(data));
    tt.true(data.equals(output));
});

test('MapSchema can normalize empty objects', (tt: *) => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    tt.deepEqual(entities, {});
    tt.deepEqual(result.toJS(), {bar: {}});
});

test('MapSchema can denormalize objects', (tt: *) => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize({result: Map({foo: "1"}), entities}).toJS(),
        {foo: {id: "1"}}
    );
});


test('MapSchema will not denormalize null values', (tt: *) => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize({result: null, entities}),
        null
    );
});

test('MapSchema will not denormalize unknown keys', (tt: *) => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize({result: Map({foo: "1", bar: "2"}), entities}).toJS(),
        {foo: {id: "1"}, bar: "2"}
    );
});

test('MapSchema will filter out DELETED_ENTITY keys', (tt: *) => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    tt.deepEqual(
        schema.denormalize({result: Map({foo: "1"}), entities}).toJS(),
        {}
    );
});

test('MapSchema will pass any deleted keys to options.denormalizeFilter', (tt: *) => {
    const schema = MapSchema({foo}, {
        denormalizeFilter: (item, deletedKeys) => tt.deepEqual(deletedKeys, ['foo'])
    });

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    schema.denormalize({result: Map({foo: "1"}), entities});
});

test('MapSchema will not mutate input objects', (tt: *) => {
    const schema = MapSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: "1"}});
});


//
// Getters and Setters
//
test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = MapSchema({foo});
    t.is(schema.set('bar', bar), schema);
    t.is(schema.get('foo'), foo);
    t.is(schema.update(() => schema.definition), schema);
});

test('set will replace the definition at a key', (t: *) => {
    const schema = MapSchema({foo});
    schema.set('bar', bar);
    t.is(schema.definition.bar, bar);
});

test('get will return the definition at a key', (t: *) => {
    const schema = MapSchema({foo});
    t.is(schema.get('foo'), foo);
});

test('update will replace the definition at a key via an updater function', (t: *) => {
    const schema = MapSchema({foo});
    schema.update('foo', () => bar);
    t.is(schema.definition.foo, bar);
});

test('update will replace the whole definition via an updater function', (t: *) => {
    const schema = MapSchema({foo});
    schema.update(() => ({bar}));
    t.is(schema.definition.bar, bar);
});

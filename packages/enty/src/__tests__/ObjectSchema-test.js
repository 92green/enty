//@flow
import test from 'ava';
import ObjectSchema from '../ObjectSchema';
import EntitySchema from '../EntitySchema';

var foo = EntitySchema('foo').set(ObjectSchema());
var bar = EntitySchema('bar').set(ObjectSchema());

test('ObjectSchema can normalize objects', (tt: *) => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    tt.deepEqual(result, {foo: "1"});
    tt.deepEqual(entities.foo["1"], {id: "1"});
});

test('ObjectSchema can normalize maps', (tt: *) => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    tt.deepEqual(result, {foo: "1"});
    tt.deepEqual(entities.foo["1"], {id: "1"});
});

test('ObjectSchema.denormalize is the inverse of ObjectSchema.normalize', (tt: *) => {
    const schema = ObjectSchema({foo});
    const data = {foo: {id: "1"}};
    const output = schema.denormalize(schema.normalize(data));
    tt.deepEqual(data, output);
});

test('ObjectSchema can normalize empty objects', (tt: *) => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    tt.deepEqual(entities, {});
    tt.deepEqual(result, {bar: {}});
});

test('ObjectSchema can denormalize objects', (tt: *) => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    tt.deepEqual(
        schema.denormalize({result: {foo: "1"}, entities}),
        {foo: {id: "1"}}
    );
});


test('ObjectSchema will not denormalize null values', (tt: *) => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    tt.deepEqual(
        schema.denormalize({result: null, entities}),
        null
    );
});

test('ObjectSchema will not denormalize unknown keys', (tt: *) => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    tt.deepEqual(
        schema.denormalize({result: {foo: "1", bar: "2"}, entities}),
        {foo: {id: "1"}, bar: "2"}
    );
});

test('ObjectSchema will filter out DELETED_ENTITY keys', (tt: *) => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1", deleted: true}
        }
    };

    tt.deepEqual(
        schema.denormalize({result: {foo: "1"}, entities}),
        {}
    );
});

test('ObjectSchema will pass any deleted keys to options.denormalizeFilter', (tt: *) => {
    const schema = ObjectSchema({foo}, {
        denormalizeFilter: (item, deletedKeys) => tt.deepEqual(deletedKeys, ['foo'])
    });

    const entities = {
        foo: {
            "1": {id: "1", deleted: true}
        }
    };

    schema.denormalize({result: {foo: "1"}, entities});
});


test('ObjectSchema will not mutate input objects', (tt: *) => {
    const schema = ObjectSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: "1"}});
});



test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = ObjectSchema({foo});
    t.is(schema.set('bar', bar), schema);
    t.is(schema.get('foo'), foo);
    t.is(schema.update(() => schema.definition), schema);
});

test('ObjectSchema.set will replace the definition at a key', (t: *) => {
    const schema = ObjectSchema({foo});
    schema.set('bar', bar);
    t.is(schema.definition.bar, bar);
});

test('ObjectSchema.get will return the definition at a key', (t: *) => {
    const schema = ObjectSchema({foo});
    t.is(schema.get('foo'), foo);
});

test('ObjectSchema.update will replace the definition at a key via an updater function', (t: *) => {
    const schema = ObjectSchema({foo});
    schema.update('foo', () => bar);
    t.is(schema.definition.foo, bar);
});

test('ObjectSchema.update will replace the whole definition via an updater function', (t: *) => {
    const schema = ObjectSchema({foo});
    schema.update(() => ({bar}));
    t.is(schema.definition.bar, bar);
});

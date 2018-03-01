//@flow
import test from 'ava';
import ObjectSchema from '../ObjectSchema';
import EntitySchema from '../EntitySchema';

var foo = EntitySchema('foo').define(ObjectSchema());
var bar = EntitySchema('bar').define(ObjectSchema());

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


test('ObjectSchema.merge() will perform a shallow merge of options and definition', (tt: *) => {
    const denormalizeFilter = () => true;
    const aa = ObjectSchema({foo});
    const bb = ObjectSchema({bar}, {denormalizeFilter});
    const merged = aa.merge(bb);


    tt.is(merged.definition.foo.name, 'foo');
    tt.is(merged.definition.bar.name, 'bar');
    tt.is(merged.options.denormalizeFilter, denormalizeFilter);
});


test('ObjectSchema will not mutate input objects', (tt: *) => {
    const schema = ObjectSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: "1"}});
});



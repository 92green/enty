import test from 'ava';
import {EntitySchema, MapSchema} from '../../index';
import {fromJS, Map} from 'immutable';

var foo = EntitySchema('foo');

test('MapSchema can normalize objects', tt => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    tt.deepEqual(result.toJS(), {foo: "1"});
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('MapSchema can normalize maps', tt => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize(Map({foo: {id: "1"}}));

    tt.deepEqual(result.toJS(), {foo: "1"});
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});

test('MapSchema.denormalize is the inverse of MapSchema.normalize', tt => {
    const schema = MapSchema({foo});
    const data = Map({foo: Map({id: "1"})});
    const output = schema.denormalize(schema.normalize(data));
    tt.true(data.equals(output));
});

test('MapSchema can normalize empty objects', tt => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    tt.deepEqual(entities, {});
    tt.deepEqual(result.toJS(), {bar: {}});
});

test('MapSchema can denormalize objects', tt => {
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


test('MapSchema will not denormalize null values', tt => {
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

test('MapSchema will not denormalize unknown keys', tt => {
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

test('MapSchema will filter out DELETED_ENTITY keys', tt => {
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

test('MapSchema will pass any deleted keys to options.denormalizeFilter', tt => {
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


test('MapSchema.merge() will perform a shallow merge of options and definition', tt => {
    const denormalizeFilter = () => true;
    const foo = EntitySchema('foo');
    const bar = EntitySchema('bar');
    const aa = MapSchema({foo});
    const bb = MapSchema({bar}, {denormalizeFilter});
    const merged = aa.merge(bb);


    tt.is(merged.definition.foo.name, 'foo');
    tt.is(merged.definition.bar.name, 'bar');
    tt.is(merged.options.denormalizeFilter, denormalizeFilter);
});


test('MapSchema will not mutate input objects', tt => {
    const foo = EntitySchema('foo');
    const schema = MapSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: "1"}});
});



import test from 'ava';
import {EntitySchema, ObjectSchema} from '../../index';
import {fromJS, Map} from 'immutable';

var foo = EntitySchema('foo');

test('ObjectSchema can normalize objects', tt => {
    const schema = ObjectSchema({foo});
    tt.deepEqual(
        schema.normalize({foo: {id: 1}}, schema),
        {
            entities: {
                foo: {
                    "1": {id: 1}
                }
            },
            result: {foo: 1}
        }
    );

    tt.deepEqual(
        schema.normalize({bar: {}}, schema),
        {
            entities: {},
            result: {bar: {}}
        }
    );
});

test('ObjectSchema can denormalize objects', tt => {
    const schema = ObjectSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize(Map({foo: "1"}), schema, entities).toJS(),
        {foo: {id: "1"}}
    );
});

test('ObjectSchema will not denormalize null values', tt => {
    const schema = ObjectSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize(null, schema, entities),
        null
    );
});

test('ObjectSchema will not denormalize unknown keys', tt => {
    const schema = ObjectSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    tt.deepEqual(
        schema.denormalize(Map({foo: "1", bar: "2"}), schema, entities).toJS(),
        {foo: {id: "1"}, bar: "2"}
    );
});

test('ObjectSchema will filter out DELETED_ENTITY keys', tt => {
    const schema = ObjectSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    tt.deepEqual(
        schema.denormalize(Map({foo: "1"}), schema, entities).toJS(),
        {}
    );
});

test('ObjectSchema will pass any deleted keys to options.denormalizeFilter', tt => {
    const schema = ObjectSchema({foo}, {
        denormalizeFilter: (item, deletedKeys) => tt.deepEqual(deletedKeys, ['foo'])
    });

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    schema.denormalize(Map({foo: "1"}), schema, entities);
});


test('ObjectSchema.merge() will perform a shallow merge of options and itemSchema', tt => {
    const denormalizeFilter = () => true;
    const foo = EntitySchema('foo');
    const bar = EntitySchema('bar');
    const aa = ObjectSchema({foo});
    const bb = ObjectSchema({bar}, {denormalizeFilter});
    const merged = aa.merge(bb);


    tt.is(merged.itemSchema.foo.name, 'foo');
    tt.is(merged.itemSchema.bar.name, 'bar');
    tt.is(merged.options.denormalizeFilter, denormalizeFilter);
});


test('ObjectSchema will not mutate input objects', tt => {
    const foo = EntitySchema('foo');
    const schema = ObjectSchema({foo});
    const objectTest = {foo: {id: 1}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: 1}});
});



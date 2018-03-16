//@flow
import test from 'ava';
import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';

const foo = EntitySchema('foo').set(ObjectSchema());

test('ArraySchema can normalize arrays', (tt: *) => {
    const schema = ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    tt.deepEqual(entities.foo["1"], {id: "1"});
    tt.deepEqual(entities.foo["2"], {id: "2"});
    tt.deepEqual(result, ["1", "2"]);
});

test('ArraySchema can normalize Lists', (tt: *) => {
    const schema = ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    tt.deepEqual(entities.foo["1"], {id: "1"});
    tt.deepEqual(entities.foo["2"], {id: "2"});
    tt.deepEqual(result, ["1", "2"]);
});

test('ArraySchema can normalize nested things in arrays', (tt: *) => {
    const schema = ArraySchema(ObjectSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: "1"}}]);

    tt.deepEqual(result, [{foo: "1"}]);
    tt.deepEqual(entities.foo["1"], {id: "1"});
});


test('ArraySchema can denormalize arrays', (tt: *) => {
    const schema = ArraySchema(foo);
    const entities = {
        foo: {
            "1": {id: "1"},
            "2": {id: "2"}
        }
    };
    tt.deepEqual(
        schema.denormalize({result: ["1", "2"], entities}).map(ii => ii),
        [{id: "1"}, {id: "2"}]
    );

    tt.deepEqual(schema.denormalize({result: null, entities}), null);
});


test('ArraySchema will not return deleted entities', (tt: *) => {
    const schema = ArraySchema(foo);
    const entities = {
        foo: {
            "1": {id: "1"},
            "2": {id: "2"},
            "3": {id: "3", deleted: true}
        }
    };
    tt.deepEqual(
        schema.denormalize({result: ["1", "2", "3"], entities}).map(ii => ii),
        [{id: "1"}, {id: "2"}]
    );

    tt.deepEqual(schema.denormalize({result: null, entities}), null);
});


test('ArraySchema will not try to denormalize null values', (tt: *) => {
    const schema = ArraySchema(foo);
    tt.deepEqual(schema.denormalize({result: null, entities: {}}), null);
});


test('ArraySchema will not mutate input objects', (tt: *) => {

    const schema = ArraySchema(foo);
    const arrayTest = [{id: "1"}];

    schema.normalize(arrayTest);
    tt.deepEqual(arrayTest, [{id: "1"}]);
});


//
// Setters and Getters
//

test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = ArraySchema();
    t.is(schema.set(foo), schema);
    t.is(schema.get(), foo);
    t.is(schema.update(() => schema.definition), schema);
});

test('ArraySchema.set will replace the definition at a key', (t: *) => {
    const schema = ArraySchema();
    schema.set(foo);
    t.is(schema.definition, foo);
});

test('ArraySchema.get will return the definition at a key', (t: *) => {
    const schema = ArraySchema(foo);
    t.is(schema.get(), foo);
});

test('ArraySchema.update will replace the whole definition via an updater function', (t: *) => {
    const schema = ArraySchema(foo);
    schema.update(() => foo);
    t.is(schema.definition, foo);
});


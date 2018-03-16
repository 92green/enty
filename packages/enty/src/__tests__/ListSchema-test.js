//@flow
import test from 'ava';
import EntitySchema from '../EntitySchema';
import ListSchema from '../ListSchema';
import MapSchema from '../MapSchema';
import {fromJS} from 'immutable';

const foo = EntitySchema('foo').set(MapSchema());

test('ListSchema can normalize arrays', (tt: *) => {
    const schema = ListSchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
    tt.deepEqual(entities.foo["2"].toJS(), {id: "2"});
    tt.deepEqual(result.toJS(), ["1", "2"]);
});

test('ListSchema can normalize Lists', (tt: *) => {
    const schema = ListSchema(foo);
    const {entities, result} = schema.normalize(fromJS([{id: "1"}, {id: "2"}]));

    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
    tt.deepEqual(entities.foo["2"].toJS(), {id: "2"});
    tt.deepEqual(result.toJS(), ["1", "2"]);
});

test('ListSchema can normalize nested things in arrays', (tt: *) => {
    const schema = ListSchema(MapSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: "1"}}]);

    tt.deepEqual(result.toJS(), [{foo: "1"}]);
    tt.deepEqual(entities.foo["1"].toJS(), {id: "1"});
});


test('ListSchema can denormalize arrays', (tt: *) => {
    const schema = ListSchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: "1"},
            "2": {id: "2"}
        }
    });
    tt.deepEqual(
        schema.denormalize({result: ["1", "2"], entities}).map(ii => ii.toJS()),
        [{id: "1"}, {id: "2"}]
    );

    tt.deepEqual(schema.denormalize({result: null, entities}), null);
});


test('ListSchema will not return deleted entities', (tt: *) => {
    const schema = ListSchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: "1"},
            "2": {id: "2"},
            "3": {id: "3", deleted: true}
        }
    });
    tt.deepEqual(
        schema.denormalize({result: ["1", "2", "3"], entities}).map(ii => ii.toJS()),
        [{id: "1"}, {id: "2"}]
    );

    tt.deepEqual(schema.denormalize({result: null, entities}), null);
});


test('ListSchema will not try to denormalize null values', (tt: *) => {
    const schema = ListSchema(foo);
    tt.deepEqual(schema.denormalize({result: null, entities: {}}), null);
});


test('ListSchema will not mutate input objects', (tt: *) => {

    const schema = ListSchema(foo);
    const arrayTest = [{id: "1"}];

    schema.normalize(arrayTest);
    tt.deepEqual(arrayTest, [{id: "1"}]);
});

//
// Setters and Getters
//

test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = ListSchema();
    t.is(schema.set(foo), schema);
    t.is(schema.get(), foo);
    t.is(schema.update(() => schema.definition), schema);
});

test('set will replace the definition at a key', (t: *) => {
    const schema = ListSchema();
    schema.set(foo);
    t.is(schema.definition, foo);
});

test('get will return the definition at a key', (t: *) => {
    const schema = ListSchema(foo);
    t.is(schema.get(), foo);
});

test('update will replace the whole definition via an updater function', (t: *) => {
    const schema = ListSchema(foo);
    schema.update(() => foo);
    t.is(schema.definition, foo);
});

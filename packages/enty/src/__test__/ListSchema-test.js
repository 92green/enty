//@flow
import EntitySchema from '../EntitySchema';
import ListSchema from '../ListSchema';
import MapSchema from '../MapSchema';
import {fromJS} from 'immutable';
import {List} from 'immutable';

const foo = EntitySchema('foo').set(MapSchema());

test('ListSchema can normalize arrays', () => {
    const schema = ListSchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    expect(entities.foo["1"].toJS()).toEqual({id: "1"});
    expect(entities.foo["2"].toJS()).toEqual({id: "2"});
    expect(result.toJS()).toEqual(["1", "2"]);
});

test('ListSchema can normalize Lists', () => {
    const schema = ListSchema(foo);
    const {entities, result} = schema.normalize(fromJS([{id: "1"}, {id: "2"}]));

    expect(entities.foo["1"].toJS()).toEqual({id: "1"});
    expect(entities.foo["2"].toJS()).toEqual({id: "2"});
    expect(result.toJS()).toEqual(["1", "2"]);
});

test('ListSchema can normalize nested things in arrays', () => {
    const schema = ListSchema(MapSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: "1"}}]);

    expect(result.toJS()).toEqual([{foo: "1"}]);
    expect(entities.foo["1"].toJS()).toEqual({id: "1"});
});


test('ListSchema can denormalize arrays', () => {
    const schema = ListSchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: "1"},
            "2": {id: "2"}
        }
    });
    expect(schema.denormalize({result: ["1", "2"], entities}).map(ii => ii.toJS())).toEqual([{id: "1"}, {id: "2"}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});


test('ListSchema will not return deleted entities', () => {
    const schema = ListSchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: "1"},
            "2": {id: "2"},
            "3": {id: "3", deleted: true}
        }
    });
    expect(
        schema.denormalize({result: ["1", "2", "3"], entities}).map(ii => ii.toJS())
    ).toEqual([{id: "1"}, {id: "2"}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});


test('ListSchema will not try to denormalize null values', () => {
    const schema = ListSchema(foo);
    expect(schema.denormalize({result: null, entities: {}})).toEqual(null);
});


test('ListSchema will not mutate input objects', () => {
    const schema = ListSchema(foo);
    const arrayTest = [{id: "1"}];

    schema.normalize(arrayTest);
    expect(arrayTest).toEqual([{id: "1"}]);
});

test('ListSchema can merge lists by replacing the previous with the next', () => {
    const schema = ListSchema(foo);
    expect(List([2]).equals(schema.options.merge(List([1]), List([2])))).toBe(true);
});

//
// Seters and Geters
//

test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = ListSchema();
    expect(schema.set(foo)).toBe(schema);
    expect(schema.get()).toBe(foo);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('set will replace the definition at a key', () => {
    const schema = ListSchema();
    schema.set(foo);
    expect(schema.definition).toBe(foo);
});

test('get will return the definition at a key', () => {
    const schema = ListSchema(foo);
    expect(schema.get()).toBe(foo);
});

test('update will replace the whole definition via an updater function', () => {
    const schema = ListSchema(foo);
    schema.update(() => foo);
    expect(schema.definition).toBe(foo);
});

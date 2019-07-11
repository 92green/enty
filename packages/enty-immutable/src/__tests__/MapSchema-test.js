//@flow
import {EntitySchema} from 'enty';
import MapSchema from '../MapSchema';
import {fromJS, Map} from 'immutable';
import {DELETED_ENTITY} from 'enty/lib/util/SchemaConstant';

var foo = EntitySchema('foo').set(MapSchema());
var bar = EntitySchema('bar').set(MapSchema());

describe('MapSchema.options', () => {

    test('constructor will return a map', () => {
        const data = {first: 'foo', last: 'bar'};
        const {result} = MapSchema({}).normalize(data);
        expect(result).toBeInstanceOf(Map);
        expect(result.equals(Map(data))).toBe(true);
    });

    test('denormalizeFilter will check for existance and a key of deleted', () => {
        const schema = MapSchema({});
        const deleted = schema.denormalize(schema.normalize({deleted: true}));
        schema.denormalize(schema.normalize(null));
        expect(deleted).toBe(DELETED_ENTITY);
    });

    test('merge will merge two maps', () => {
        const schema = EntitySchema('foo').set(MapSchema());
        const stateA = schema.normalize({id: 'a', first: 'foo'}, {});
        const stateB = schema.normalize({id: 'a', last: 'bar'}, stateA.entities);
        expect(stateB.entities.foo.a).toEqual(Map({id: 'a', first: 'foo', last: 'bar'}));
    });
});


// Copy from Object Schema tests. Probably redundant.

test('MapSchema can normalize objects', () => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    expect(result.toJS()).toEqual({foo: "1"});
    expect(entities.foo["1"].toJS()).toEqual({id: "1"});
});

test('MapSchema can normalize maps', () => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize(Map({foo: {id: "1"}}));

    expect(result.toJS()).toEqual({foo: "1"});
    expect(entities.foo["1"].toJS()).toEqual({id: "1"});
});

test('MapSchema.denormalize is the inverse of MapSchema.normalize', () => {
    const schema = MapSchema({foo});
    const data = Map({foo: Map({id: "1"})});
    const output = schema.denormalize(schema.normalize(data));
    expect(data.equals(output)).toBe(true);
});

test('MapSchema can normalize empty objects', () => {
    const schema = MapSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    expect(entities).toEqual({});
    expect(result.toJS()).toEqual({bar: {}});
});

test('MapSchema can denormalize objects', () => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    expect(schema.denormalize({result: Map({foo: "1"}), entities}).toJS()).toEqual({foo: {id: "1"}});
});


test('MapSchema will not denormalize null values', () => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('MapSchema will not denormalize unknown keys', () => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1"}
        }
    });

    expect(schema.denormalize({result: Map({foo: "1", bar: "2"}), entities}).toJS()).toEqual({foo: {id: "1"}, bar: "2"});
});

test('MapSchema will filter out DELETED_ENTITY keys', () => {
    const schema = MapSchema({foo});

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    expect(schema.denormalize({result: Map({foo: "1"}), entities}).toJS()).toEqual({});
});

test('MapSchema will pass any deleted keys to options.denormalizeFilter', () => {
    const schema = MapSchema({foo}, {
        denormalizeFilter: (item, deletedKeys) => expect(deletedKeys).toEqual(['foo'])
    });

    const entities = fromJS({
        foo: {
            "1": {id: "1", deleted: true}
        }
    });

    schema.denormalize({result: Map({foo: "1"}), entities});
});

test('MapSchema will not mutate input objects', () => {
    const schema = MapSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    expect(objectTest).toEqual({foo: {id: "1"}});
});


//
// Geters and Seters
//
test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = MapSchema({foo});
    expect(schema.set('bar', bar)).toBe(schema);
    expect(schema.get('foo')).toBe(foo);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('set will replace the definition at a key', () => {
    const schema = MapSchema({foo});
    schema.set('bar', bar);
    expect(schema.definition.bar).toBe(bar);
});

test('get will return the definition at a key', () => {
    const schema = MapSchema({foo});
    expect(schema.get('foo')).toBe(foo);
});

test('update will replace the definition at a key via an updater function', () => {
    const schema = MapSchema({foo});
    schema.update('foo', () => bar);
    expect(schema.definition.foo).toBe(bar);
});

test('update will replace the whole definition via an updater function', () => {
    const schema = MapSchema({foo});
    schema.update(() => ({bar}));
    expect(schema.definition.bar).toBe(bar);
});

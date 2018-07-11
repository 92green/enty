//@flow
import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';

const foo = EntitySchema('foo').set(ObjectSchema());

test('ArraySchema can normalize arrays', () => {
    const schema = ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    expect(entities.foo["1"]).toEqual({id: "1"});
    expect(entities.foo["2"]).toEqual({id: "2"});
    expect(result).toEqual(["1", "2"]);
});

test('ArraySchema can normalize Lists', () => {
    const schema = ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: "1"}, {id: "2"}]);

    expect(entities.foo["1"]).toEqual({id: "1"});
    expect(entities.foo["2"]).toEqual({id: "2"});
    expect(result).toEqual(["1", "2"]);
});

test('ArraySchema can normalize nested things in arrays', () => {
    const schema = ArraySchema(ObjectSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: "1"}}]);

    expect(result).toEqual([{foo: "1"}]);
    expect(entities.foo["1"]).toEqual({id: "1"});
});


test('ArraySchema can denormalize arrays', () => {
    const schema = ArraySchema(foo);
    const entities = {
        foo: {
            "1": {id: "1"},
            "2": {id: "2"}
        }
    };
    expect(schema.denormalize({result: ["1", "2"], entities}).map(ii => ii)).toEqual([{id: "1"}, {id: "2"}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});


test('ArraySchema will not return deleted entities', () => {
    const schema = ArraySchema(foo);
    const entities = {
        foo: {
            "1": {id: "1"},
            "2": {id: "2"},
            "3": {id: "3", deleted: true}
        }
    };
    expect(schema.denormalize({result: ["1", "2", "3"], entities}).map(ii => ii)).toEqual([{id: "1"}, {id: "2"}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});


test('ArraySchema will not try to denormalize null values', () => {
    const schema = ArraySchema(foo);
    expect(schema.denormalize({result: null, entities: {}})).toEqual(null);
});


test('ArraySchema will not mutate input objects', () => {

    const schema = ArraySchema(foo);
    const arrayTest = [{id: "1"}];

    schema.normalize(arrayTest);
    expect(arrayTest).toEqual([{id: "1"}]);
});


//
// Seters and Geters
//

test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = ArraySchema();
    expect(schema.set(foo)).toBe(schema);
    expect(schema.get()).toBe(foo);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('ArraySchema.set will replace the definition at a key', () => {
    const schema = ArraySchema();
    schema.set(foo);
    expect(schema.definition).toBe(foo);
});

test('ArraySchema.get will return the definition at a key', () => {
    const schema = ArraySchema(foo);
    expect(schema.get()).toBe(foo);
});

test('ArraySchema.update will replace the whole definition via an updater function', () => {
    const schema = ArraySchema(foo);
    schema.update(() => foo);
    expect(schema.definition).toBe(foo);
});


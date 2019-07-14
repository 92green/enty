//@flow
import ObjectSchema from '../ObjectSchema';
import EntitySchema from '../EntitySchema';

var foo = EntitySchema('foo').set(ObjectSchema());
var bar = EntitySchema('bar').set(ObjectSchema());

test('ObjectSchema can normalize objects', () => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    expect(result).toEqual({foo: "1"});
    expect(entities.foo["1"]).toEqual({id: "1"});
});

test('ObjectSchema can normalize maps', () => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: "1"}});

    expect(result).toEqual({foo: "1"});
    expect(entities.foo["1"]).toEqual({id: "1"});
});

test('ObjectSchema.denormalize is the inverse of ObjectSchema.normalize', () => {
    const schema = ObjectSchema({foo});
    const data = {foo: {id: "1"}};
    const output = schema.denormalize(schema.normalize(data));
    expect(data).toEqual(output);
});

test('ObjectSchema can normalize empty objects', () => {
    const schema = ObjectSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    expect(entities).toEqual({});
    expect(result).toEqual({bar: {}});
});

test('ObjectSchema can denormalize objects', () => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    expect(schema.denormalize({result: {foo: "1"}, entities})).toEqual({foo: {id: "1"}});
});


test('ObjectSchema will not denormalize null values', () => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('ObjectSchema will not denormalize unknown keys', () => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    expect(schema.denormalize({result: {foo: "1", bar: "2"}, entities})).toEqual({foo: {id: "1"}, bar: "2"});
});

test('ObjectSchema will filter out DELETED_ENTITY keys', () => {
    const schema = ObjectSchema({foo});

    const entities = {
        foo: {
            "1": {id: "1", deleted: true}
        }
    };

    expect(schema.denormalize({result: {foo: "1"}, entities})).toEqual({});
});

test('ObjectSchema can denormalize objects without mutating', () => {
    const schema = ObjectSchema({foo});

    const result = {foo: "1"};
    const originalResult = {...result};

    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    schema.denormalize({result, entities});

    expect(result).toEqual(originalResult);
});


test('ObjectSchema will pass any deleted keys to options.denormalizeFilter', () => {
    const schema = ObjectSchema({foo}, {
        denormalizeFilter: (item, deletedKeys) => expect(deletedKeys).toEqual(['foo'])
    });

    const entities = {
        foo: {
            "1": {id: "1", deleted: true}
        }
    };

    schema.denormalize({result: {foo: "1"}, entities});
});


test('ObjectSchema will not mutate input objects', () => {
    const schema = ObjectSchema({foo});
    const objectTest = {foo: {id: "1"}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    expect(objectTest).toEqual({foo: {id: "1"}});
});



test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = ObjectSchema({foo});
    expect(schema.set('bar', bar)).toBe(schema);
    expect(schema.get('foo')).toBe(foo);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('ObjectSchema.set will replace the definition at a key', () => {
    const schema = ObjectSchema({foo});
    schema.set('bar', bar);
    expect(schema.definition.bar).toBe(bar);
});

test('ObjectSchema.get will return the definition at a key', () => {
    const schema = ObjectSchema({foo});
    expect(schema.get('foo')).toBe(foo);
});

test('ObjectSchema.update will replace the definition at a key via an updater function', () => {
    const schema = ObjectSchema({foo});
    schema.update('foo', () => bar);
    expect(schema.definition.foo).toBe(bar);
});

test('ObjectSchema.update will replace the whole definition via an updater function', () => {
    const schema = ObjectSchema({foo});
    schema.update(() => ({bar}));
    expect(schema.definition.bar).toBe(bar);
});

test('ObjectSchemas can construct objects', () => {
    class Foo {
        first: string;
        last: string;
        name: string;
        constructor(data) {
            this.first = data.first;
            this.last = data.last;
            this.name = `${data.first} ${data.last}`;
        }
    }
    const schema = ObjectSchema({}, {
        constructor: data => new Foo(data)
    });
    const state = schema.normalize({first: 'foo', last: 'bar'}, schema);
    expect(state.result).toBeInstanceOf(Foo);
    expect(state.result.name).toBe('foo bar');
});


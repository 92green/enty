//@flow
import EntitySchema from '../EntitySchema';
import ObjectSchema from '../ObjectSchema';
import ValueSchema from '../ValueSchema';

const foo = EntitySchema('foo', {
    definition: ObjectSchema({})
})

const fooValues = ObjectSchema({
    foo: ValueSchema(foo)
});



test('denormalize is almost the inverse of normalize', () => {
    const data = {foo: '1'};
    expect(data.foo).toEqual(fooValues.denormalize(fooValues.normalize(data)).foo.id);
});

test('normalize', () => {
    const data = {id: '1'};
    const entities = {
        foo: {
            "1": data
        }
    };
    expect(data).toEqual(ValueSchema(foo).normalize('1', entities).entities.foo['1']);
    expect(data).toEqual(ValueSchema(foo).normalize('1', undefined).entities.foo['1']);
});

test('denormalize', () => {
    const data = {id: '1'};
    const entities = {
        foo: {
            "1": data
        }
    };
    expect(data).toEqual(ValueSchema(foo).denormalize({result: '1', entities}));
    expect(data).toEqual(ValueSchema(foo).denormalize({result: '1', entities}, undefined));
});


//
// Geters and Seters
//
test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = ValueSchema();
    expect(schema.set(foo)).toBe(schema);
    expect(schema.get()).toBe(foo);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('set will replace the definition at a key', () => {
    const schema = ValueSchema();
    schema.set(foo);
    expect(schema.definition).toBe(foo);
});

test('get will return the definition at a key', () => {
    const schema = ValueSchema(foo);
    expect(schema.get()).toBe(foo);
});

test('update will replace the whole definition via an updater function', () => {
    const schema = ValueSchema(foo);
    schema.update(() => foo);
    expect(schema.definition).toBe(foo);
});

//@flow
import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import DynamicSchema from '../DynamicSchema';
import ObjectSchema from '../ObjectSchema';

const foo = EntitySchema('foo').set(ObjectSchema());
const bar = EntitySchema('bar').set(ObjectSchema());
const baz = EntitySchema('baz').set(ObjectSchema());

const fooBarBaz = DynamicSchema((data: *): * => {
    switch(data.type || data.get('type')) {
        case 'foo':
            return foo;
        case 'bar':
            return bar;
        case 'baz':
            return baz;
    }
});


test('DynamicSchema can choose an appropriate schema to normalize', () => {
    const unknownArray = ArraySchema(fooBarBaz);
    const data = [
        {type: 'foo', id: '0'},
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];
    const {entities} = unknownArray.normalize(data);


    expect(entities.foo['0']).toEqual(data[0]);
    expect(entities.bar['1']).toEqual(data[1]);
    expect(entities.baz['2']).toEqual(data[2]);
});


test('DynamicSchema.denormalize is the inverse of DynamicSchema.normalize', () => {
    const schema = ArraySchema(fooBarBaz);
    const data = [
        {type: 'foo', id: '0'},
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];
    const output = schema.denormalize(schema.normalize(data));
    expect(data).toEqual(output);
});

test('DynamicSchema.normalize', () => {
    const data = {type: 'foo', id: '0'};
    const output = fooBarBaz.denormalize(fooBarBaz.normalize(data));
    expect(data).toEqual(output);
});



test('DynamicSchema.normalize on to existing data', () => {
    const schema = ArraySchema(fooBarBaz);

    const first = [
        {type: 'foo', id: '0'}
    ];

    const second = [
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];

    const {entities} = schema.normalize(first);
    const output = schema.normalize(second, entities);

    expect(output.entities.foo['0']).toEqual(first[0]);
    expect(output.entities.bar['1']).toEqual(second[0]);
    expect(output.entities.baz['2']).toEqual(second[1]);
});


//
// Geters and Seters
//
test('set, get & update dont mutate the schema while still returning it', () => {
    const schema = DynamicSchema();
    expect(schema.set(fooBarBaz)).toBe(schema);
    expect(schema.get()).toBe(fooBarBaz);
    expect(schema.update(() => schema.definition)).toBe(schema);
});

test('set will replace the definition at a key', () => {
    const schema = DynamicSchema();
    schema.set(fooBarBaz);
    expect(schema.definition).toBe(fooBarBaz);
});

test('get will return the definition at a key', () => {
    const schema = DynamicSchema(fooBarBaz);
    expect(schema.get()).toBe(fooBarBaz);
});

test('update will replace the whole definition via an updater function', () => {
    const schema = DynamicSchema(fooBarBaz);
    schema.update(() => fooBarBaz);
    expect(schema.definition).toBe(fooBarBaz);
});

//@flow
import test from 'ava';
import EntitySchema from '../EntitySchema';
import ListSchema from '../ListSchema';
import DynamicSchema from '../DynamicSchema';
import MapSchema from '../MapSchema';

const foo = EntitySchema('foo').set(MapSchema());
const bar = EntitySchema('bar').set(MapSchema());
const baz = EntitySchema('baz').set(MapSchema());

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


test('DynamicSchema can choose an appropriate schema to normalize', (tt: *) => {
    const unknownArray = ListSchema(fooBarBaz);
    const data = [
        {type: 'foo', id: '0'},
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];
    const {entities} = unknownArray.normalize(data);


    tt.deepEqual(entities.foo['0'].toJS(), data[0]);
    tt.deepEqual(entities.bar['1'].toJS(), data[1]);
    tt.deepEqual(entities.baz['2'].toJS(), data[2]);
});


test('DynamicSchema.denormalize is the inverse of DynamicSchema.normalize', (tt: *) => {
    const schema = ListSchema(fooBarBaz);
    const data = [
        {type: 'foo', id: '0'},
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];
    const output = schema.denormalize(schema.normalize(data));


    tt.deepEqual(data, output.toJS());
});

test('DynamicSchema.normalize', (tt: *) => {
    const data = {type: 'foo', id: '0'};
    const output = fooBarBaz.denormalize(fooBarBaz.normalize(data));
    tt.deepEqual(data, output.toJS());
});



test('DynamicSchema.normalize on to existing data', (tt: *) => {
    const schema = ListSchema(fooBarBaz);

    const first = [
        {type: 'foo', id: '0'}
    ];

    const second = [
        {type: 'bar', id: '1'},
        {type: 'baz', id: '2'}
    ];

    const {entities} = schema.normalize(first);
    const output = schema.normalize(second, entities);

    tt.deepEqual(output.entities.foo['0'].toJS(), first[0]);
    tt.deepEqual(output.entities.bar['1'].toJS(), second[0]);
    tt.deepEqual(output.entities.baz['2'].toJS(), second[1]);
});


//
// Getters and Setters
//
test('set, get & update dont mutate the schema while still returning it', (t: *) => {
    const schema = DynamicSchema();
    t.is(schema.set(fooBarBaz), schema);
    t.is(schema.get(), fooBarBaz);
    t.is(schema.update(() => schema.definition), schema);
});

test('set will replace the definition at a key', (t: *) => {
    const schema = DynamicSchema();
    schema.set(fooBarBaz);
    t.is(schema.definition, fooBarBaz);
});

test('get will return the definition at a key', (t: *) => {
    const schema = DynamicSchema(fooBarBaz);
    t.is(schema.get(), fooBarBaz);
});

test('update will replace the whole definition via an updater function', (t: *) => {
    const schema = DynamicSchema(fooBarBaz);
    schema.update(() => fooBarBaz);
    t.is(schema.definition, fooBarBaz);
});

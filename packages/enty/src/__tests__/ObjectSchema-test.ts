import {expect, it} from '@jest/globals';
import ObjectSchema from '../ObjectSchema';
import EntitySchema from '../EntitySchema';
import REMOVED_ENTITY from '../util/RemovedEntity';

var foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

it('ObjectSchema can normalize objects', () => {
    const schema = new ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: '1'}});

    expect(result).toEqual({foo: '1'});
    expect(entities.foo['1']).toEqual({id: '1'});
});

it('ObjectSchema can normalize maps', () => {
    const schema = new ObjectSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: '1'}});

    expect(result).toEqual({foo: '1'});
    expect(entities.foo['1']).toEqual({id: '1'});
});

it('ObjectSchema.denormalize is the inverse of ObjectSchema.normalize', () => {
    const schema = new ObjectSchema({foo});
    const data = {foo: {id: '1'}};
    const output = schema.denormalize(schema.normalize(data));
    expect(data).toEqual(output);
});

it('ObjectSchema can normalize empty objects', () => {
    const schema = new ObjectSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    expect(entities).toEqual({});
    expect(result).toEqual({bar: {}});
});

it('ObjectSchema can denormalize objects', () => {
    const schema = new ObjectSchema({foo});

    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({result: {foo: '1'}, entities})).toEqual({
        foo: {id: '1'}
    });
});

it('ObjectSchema will not denormalize null values', () => {
    const schema = new ObjectSchema({foo});

    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

it('ObjectSchema will not denormalize unknown keys', () => {
    const schema = new ObjectSchema({foo});

    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({result: {foo: '1', bar: '2'}, entities})).toEqual({
        foo: {id: '1'},
        bar: '2'
    });
});

it('ObjectSchema will filter out REMOVED_ENTITY keys', () => {
    const schema = new ObjectSchema({foo});

    const entities = {
        foo: {
            '1': REMOVED_ENTITY
        }
    };

    expect(schema.denormalize({result: {foo: '1'}, entities})).toEqual({});
});

it('ObjectSchema can denormalize objects without mutating', () => {
    const schema = new ObjectSchema({foo});
    const result = {foo: '1'};
    const originalResult = {...result};
    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    schema.denormalize({result, entities});
    expect(result).toEqual(originalResult);
});

it('ObjectSchema will not mutate input objects', () => {
    const schema = new ObjectSchema({foo});
    const objectTest = {foo: {id: '1'}};

    schema.normalize(objectTest, {});
    expect(objectTest).toEqual({foo: {id: '1'}});
});

it('ObjectSchemas can create objects', () => {
    class Foo {
        first: string;
        last: string;
        name: string;
        constructor(data: {first: string; last: string}) {
            this.first = data.first;
            this.last = data.last;
        }
    }
    const schema = new ObjectSchema(
        {},
        {
            create: (data) => new Foo(data)
        }
    );
    const state = schema.normalize({first: 'foo', last: 'bar'}, {});

    expect(state.result).toBeInstanceOf(Foo);
});

it('will not create extra keys if value is undefined', () => {
    const schema = new ObjectSchema({
        foo: new EntitySchema('foo'),
        bar: new EntitySchema('bar')
    });
    const state = schema.denormalize(schema.normalize({foo: {id: 'foo'}}, {}));

    expect(state).toHaveProperty('foo', {id: 'foo'});
    expect(state).not.toHaveProperty('bar');
});

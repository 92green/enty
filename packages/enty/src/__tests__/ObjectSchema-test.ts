import {expect, it} from '@jest/globals';
import ObjectSchema from '../ObjectSchema';
import EntitySchema from '../EntitySchema';
import REMOVED_ENTITY from '../util/RemovedEntity';

var foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

it('ObjectSchema can normalize objects', () => {
    const schema = new ObjectSchema({foo});
    let {state, output} = schema.normalize({input: {foo: {id: '1'}}, state: {}, meta: {}});

    expect(output).toEqual({foo: '1'});
    expect(state.foo['1']).toEqual({id: '1'});
});

it('ObjectSchema can normalize maps', () => {
    const schema = new ObjectSchema({foo});
    let {state, output} = schema.normalize({
        input: {foo: {id: '1'}},
        state: {},
        meta: {}
    });

    expect(output).toEqual({foo: '1'});
    expect(state.foo['1']).toEqual({id: '1'});
});

it('ObjectSchema.denormalize is the inverse of ObjectSchema.normalize', () => {
    const schema = new ObjectSchema({foo});
    const input = {foo: {id: '1'}};
    const output = schema.denormalize(schema.normalize({input, state: {}, meta: {}}));
    expect(input).toEqual(output);
});

it('ObjectSchema can normalize empty objects', () => {
    const schema = new ObjectSchema({foo});
    let {state, output} = schema.normalize({input: {bar: {}}, state: {}, meta: {}});

    expect(state).toEqual({});
    expect(output).toEqual({bar: {}});
});

it('ObjectSchema can denormalize objects', () => {
    const schema = new ObjectSchema({foo});

    const state = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({output: {foo: '1'}, state})).toEqual({
        foo: {id: '1'}
    });
});

it('ObjectSchema will not denormalize null values', () => {
    const schema = new ObjectSchema({foo});

    const state = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({output: null, state})).toEqual(null);
});

it('ObjectSchema will not denormalize unknown keys', () => {
    const schema = new ObjectSchema({foo});

    const state = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({output: {foo: '1', bar: '2'}, state})).toEqual({
        foo: {id: '1'},
        bar: '2'
    });
});

it('ObjectSchema will filter out REMOVED_ENTITY keys', () => {
    const schema = new ObjectSchema({foo});

    const state = {
        foo: {
            '1': REMOVED_ENTITY
        }
    };

    expect(schema.denormalize({output: {foo: '1'}, state})).toEqual({});
});

it('ObjectSchema can denormalize objects without mutating', () => {
    const schema = new ObjectSchema({foo});
    const output = {foo: '1'};
    const originaloutput = {...output};
    const state = {
        foo: {
            '1': {id: '1'}
        }
    };

    schema.denormalize({output, state});
    expect(output).toEqual(originaloutput);
});

it('ObjectSchema will not mutate input objects', () => {
    const schema = new ObjectSchema({foo});
    const input = {foo: {id: '1'}};
    schema.normalize({input, state: {}, meta: {}});
    expect(input).toEqual({foo: {id: '1'}});
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
    const state = schema.normalize({input: {first: 'foo', last: 'bar'}, state: {}, meta: {}});

    expect(state.output).toBeInstanceOf(Foo);
});

it('will not create extra keys if value is undefined', () => {
    const schema = new ObjectSchema({
        foo: new EntitySchema('foo'),
        bar: new EntitySchema('bar')
    });
    const state = schema.denormalize(
        schema.normalize({input: {foo: {id: 'foo'}}, state: {}, meta: {}})
    );

    expect(state).toHaveProperty('foo', {id: 'foo'});
    expect(state).not.toHaveProperty('bar');
});

import {expect, it} from '@jest/globals';
import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';
import REMOVED_ENTITY from '../util/RemovedEntity';

const foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

it('can normalize arrays', () => {
    const schema = new ArraySchema(foo);
    const {state, output} = schema.normalize({input: [{id: '1'}, {id: '2'}], state: {}, meta: {}});

    expect(state.foo['1']).toEqual({id: '1'});
    expect(state.foo['2']).toEqual({id: '2'});
    expect(output).toEqual(['1', '2']);
});

it('can normalize Lists', () => {
    const schema = new ArraySchema(foo);
    const {state, output} = schema.normalize({input: [{id: '1'}, {id: '2'}], state: {}, meta: {}});

    expect(state.foo['1']).toEqual({id: '1'});
    expect(state.foo['2']).toEqual({id: '2'});
    expect(output).toEqual(['1', '2']);
});

it('can normalize nested things in arrays', () => {
    const schema = new ArraySchema(new ObjectSchema({foo}));
    const {state, output} = schema.normalize({state: {}, meta: {}, input: [{foo: {id: '1'}}]});

    expect(output).toEqual([{foo: '1'}]);
    expect(state.foo['1']).toEqual({id: '1'});
});

it('ArraySchema can denormalize arrays', () => {
    const schema = new ArraySchema(foo);
    const state = {
        foo: {
            '1': {id: '1'},
            '2': {id: '2'}
        }
    };
    expect(schema.denormalize({output: ['1', '2'], state})).toEqual([{id: '1'}, {id: '2'}]);
    expect(schema.denormalize({output: null, state})).toEqual(null);
});

it('ArraySchema will not return deleted state', () => {
    const schema = new ArraySchema(foo);
    const state = {
        foo: {
            '1': {id: '1'},
            '2': {id: '2'},
            '3': REMOVED_ENTITY
        }
    };
    expect(schema.denormalize({output: ['1', '2', '3'], state})).toEqual([{id: '1'}, {id: '2'}]);
    expect(schema.denormalize({output: null, state, path: []})).toEqual(null);
});

it('ArraySchema will not try to denormalize null values', () => {
    const schema = new ArraySchema(foo);
    expect(schema.denormalize({output: null, state: {}})).toEqual(null);
});

it('ArraySchema will not mutate input objects', () => {
    const schema = new ArraySchema(foo);
    const input = [{id: '1'}];

    schema.normalize({input, state: {}, meta: {}});
    expect(input).toEqual([{id: '1'}]);
});

it('ArraySchemas can construct custom objects', () => {
    class Foo {
        data: Array<string>;
        constructor(data) {
            this.data = data;
        }
        map(fn) {
            this.data = this.data.map(fn);
            return this;
        }
    }
    const schema = new ArraySchema(new ObjectSchema({}), {
        create: (data) => new Foo(data)
    });
    const state = schema.normalize({state: {}, meta: {}, input: [{foo: 1}, {bar: 2}]});
    expect(state.output).toBeInstanceOf(Foo);
    expect(state.output.data[0]).toEqual({foo: 1});
});

it('will default replace array on merge', () => {
    const foo = new EntitySchema('foo');
    const schema = new ArraySchema(foo);

    expect(schema.merge([1, 2, 3], [4, 5, 6])).toEqual([4, 5, 6]);
});

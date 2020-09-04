import {describe, expect, it, jest} from '@jest/globals';
import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';
import {UndefinedIdError} from '../util/Error';

var foo = new EntitySchema('foo');
var bar = new EntitySchema('bar');
var baz = new EntitySchema('baz');

foo.shape = new ObjectSchema({});
baz.shape = new ObjectSchema({bar});
bar.shape = new ObjectSchema({foo});

const meta = {};

describe('configuration', () => {
    it('can mutate its shape', () => {
        var schema = new EntitySchema('foo');
        const shape = new ObjectSchema({});
        schema.shape = shape;
        expect(schema.shape).toBe(shape);
    });

    it('will default to a ObjectSchema shape', () => {
        let schemaB = new EntitySchema('foo');
        expect(schemaB.shape).toBeInstanceOf(ObjectSchema);
    });

    it('can override the shapes merge function', () => {
        let schema = new EntitySchema('test', {
            id: () => 'aa',
            shape: new ArraySchema(new ObjectSchema({})),
            merge: (aa, bb) => aa.concat(bb)
        });

        const {state} = schema.normalize({input: [{id: 1}], state: {}, meta});
        const secondState = schema.normalize({input: [{id: 2}], state, meta});

        expect(secondState.state.test.aa).toEqual([{id: 1}, {id: 2}]);
    });
});

describe('EntitySchema.normalize', () => {
    it('can normalize state', () => {
        const {state, output} = foo.normalize({input: {id: '1'}, state: {}, meta});
        expect(output).toBe('1');
        expect(state.foo['1']).toEqual({id: '1'});
    });

    it('will not mutate input objects', () => {
        const input = {id: '1'};
        foo.normalize({input, state: {}, meta});
        expect(input).toEqual({id: '1'});
    });

    it('will collect schemas that were used', () => {
        const input = {id: '1', bar: {id: '2', foo: {id: '3'}}};
        expect(Object.keys(baz.normalize({input, state: {}, meta}).schemasUsed)).toEqual([
            'foo',
            'bar',
            'baz'
        ]);
    });

    it('will throw an error if an entity doesnt have and id', () => {
        const schema = new EntitySchema('foo', {shape: new ObjectSchema({})});
        expect(() => schema.normalize({input: {}, state: {}, meta})).toThrow(
            UndefinedIdError('foo', undefined)
        );
    });

    it('will call merge on definition when an entity already exists', () => {
        const merge = jest.fn();
        const state = {foo: {a: {id: 'a', name: 'first'}}};
        const schema = new EntitySchema('foo', {
            shape: new ObjectSchema(
                {},
                {
                    merge
                }
            )
        });

        schema.normalize({input: {id: 'a', name: 'second'}, state, meta});
        expect(merge).toHaveBeenCalledWith({id: 'a', name: 'first'}, {id: 'a', name: 'second'});
    });

    it('will treat null shapes like an Id schema', () => {
        const NullSchemaEntity = new EntitySchema('foo', {
            shape: null,
            id: (data) => `${data}-foo`
        });
        const state = NullSchemaEntity.normalize({input: 2, state: {}, meta});
        expect(state.state.foo['2-foo']).toBe(2);
    });

    it('will default id function to stringify if shape is null', () => {
        const NullSchemaEntity = new EntitySchema('foo', {
            shape: null
        });
        const state = NullSchemaEntity.normalize({input: {}, state: {}, meta: {}});
        expect(state.state.foo['[object Object]']).toEqual({});
    });
});

describe('EntitySchema.denormalize', () => {
    it('can denormalize state', () => {
        const state = {
            foo: {
                '1': {id: '1'}
            }
        };

        expect(foo.denormalize({output: '1', state})).toEqual({id: '1'});
    });

    it('will not cause an infinite recursion', () => {
        const foo = new EntitySchema('foo');
        const bar = new EntitySchema('bar');

        foo.shape = new ObjectSchema({bar});
        bar.shape = new ObjectSchema({foo});

        const state = {
            bar: {'1': {id: '1', foo: '1'}},
            foo: {'1': {id: '1', bar: '1'}}
        };

        expect(bar.denormalize({output: '1', state})).toEqual({
            id: '1',
            foo: {
                id: '1',
                bar: {
                    id: '1',
                    foo: '1'
                }
            }
        });
    });

    it('will not denormalize null state', () => {
        const state = {
            bar: {'1': {id: '1', foo: null}}
        };

        expect(bar.denormalize({output: '2', state})).toEqual(undefined);
    });

    it('can denormalize null shapes', () => {
        const NullSchemaEntity = new EntitySchema('foo', {
            shape: null,
            id: (data) => `${data}-foo`
        });
        const state = NullSchemaEntity.normalize({input: 2, state: {}, meta: {}});
        expect(NullSchemaEntity.denormalize(state)).toBe(2);
    });
});

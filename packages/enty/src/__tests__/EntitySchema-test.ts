import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';
import {UndefinedIdError} from '../util/Error';

var foo = new EntitySchema<{id: string}>('foo');
var bar = new EntitySchema<{id: string; foo: {id: string}}>('bar');
var baz = new EntitySchema<{id: string; bar: {id: string}}>('baz');

foo.shape = new ObjectSchema({});
bar.shape = new ObjectSchema<{id: string; foo: {id: string}}>({foo});
baz.shape = new ObjectSchema<{id: string; bar: {id: string}}>({bar});

describe('configuration', () => {
    it('can mutate its shape', () => {
        var schema = new EntitySchema<{}>('foo');
        const shape = new ObjectSchema({});
        schema.shape = shape;
        expect(schema.shape).toBe(shape);
    });

    it('can override the shapes merge function', () => {
        let schema = new EntitySchema('test', {
            id: () => 'aa',
            shape: new ArraySchema(new ObjectSchema({})),
            merge: (aa, bb) => aa.concat(bb)
        });

        const {entities} = schema.normalize([{id: 1}]);
        const secondState = schema.normalize([{id: 2}], entities);

        expect(secondState.entities.test.aa.data).toEqual([{id: 1}, {id: 2}]);
    });
});

describe('EntitySchema.normalize', () => {
    test('can normalize entities', () => {
        const {entities, result} = foo.normalize({id: '1'});
        expect(result).toBe('1');
        expect(entities.foo['1'].data).toEqual({id: '1'});
    });

    test('will not mutate input objects', () => {
        const entityTest = {id: '1'};
        foo.normalize(entityTest, {});
        expect(entityTest).toEqual({id: '1'});
    });

    test('will collect schemas that were used', () => {
        const entityTest = {id: '1', bar: {id: '2', foo: {id: '3'}}};
        expect(Object.keys(baz.normalize(entityTest, {}).schemas)).toEqual(['foo', 'bar', 'baz']);
    });

    test('will throw an error if an entity doesnt have and id', () => {
        const schema = new EntitySchema('foo', {shape: new ObjectSchema({})});
        expect(() => schema.normalize({}, {})).toThrow(UndefinedIdError('foo'));
    });

    test('will call merge on definition when an entity already exists', () => {
        const merge = jest.fn();
        const entities = {foo: {a: {normalizedAt: Date.now(), data: {id: 'a', name: 'first'}}}};
        const schema = new EntitySchema('foo', {
            shape: new ObjectSchema(
                {},
                {
                    merge
                }
            )
        });

        schema.normalize({id: 'a', name: 'second'}, entities);
        expect(merge).toHaveBeenCalledWith({id: 'a', name: 'first'}, {id: 'a', name: 'second'});
    });

    it('will treat null shapes like an Id schema', () => {
        const NullSchemaEntity = new EntitySchema('foo', {
            id: (data) => `${data}-foo`
        });
        const state = NullSchemaEntity.normalize(2, {});
        expect(state.entities.foo['2-foo'].data).toBe(2);
    });
});

describe('EntitySchema.denormalize', () => {
    it('can denormalize entities', () => {
        const entities = {
            foo: {'1': {normalizedAt: Date.now(), data: {id: '1'}}}
        };

        expect(foo.denormalize({result: '1', entities})).toEqual({id: '1'});
    });

    it('will not cause an infinite recursion', () => {
        type Foo = {id: string; bar: Bar};
        type Bar = {id: string; foo: Foo};

        const foo = new EntitySchema<Foo>('foo');
        const bar = new EntitySchema<Bar>('bar');

        foo.shape = new ObjectSchema<Foo>({bar});
        bar.shape = new ObjectSchema<Bar>({foo});

        const entities = {
            bar: {'1': {normalizedAt: Date.now(), data: {id: '1', foo: '1'}}},
            foo: {'1': {normalizedAt: Date.now(), data: {id: '1', bar: '1'}}}
        };

        expect(bar.denormalize({result: '1', entities})).toEqual({
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

    it('will not denormalize null entities', () => {
        const entities = {
            bar: {'1': {normalizedAt: Date.now(), data: {id: '1', foo: null}}}
        };

        expect(bar.denormalize({result: '2', entities})).toEqual(null);
    });

    it('can denormalize null shapes', () => {
        const NullSchemaEntity = new EntitySchema('foo', {
            id: (data) => `${data}-foo`
        });
        const state = NullSchemaEntity.normalize(2, {});
        expect(NullSchemaEntity.denormalize(state)).toBe(2);
    });
});

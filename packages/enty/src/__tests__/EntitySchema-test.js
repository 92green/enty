//@flow
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


describe('configuration', () => {

    it('can mutate its shape', () => {
        var schema = new EntitySchema('foo');
        const shape = new ObjectSchema({});
        schema.shape = shape;
        expect(schema.shape).toBe(shape);
    });

    it('will auto construct object and array schemas when shape is set', () => {
        let schemaA = new EntitySchema('foo', {shape: []});
        let schemaB = new EntitySchema('foo');
        schemaB.shape = {};
        expect(schemaA.shape).toBeInstanceOf(ArraySchema);
        expect(schemaB.shape).toBeInstanceOf(ObjectSchema);
    });

});



describe('EntitySchema.normalize', () => {

    test('can normalize entities', () => {
        const {entities, result} = foo.normalize({id: "1"});
        expect(result).toBe("1");
        expect(entities.foo["1"]).toEqual({id: "1"});
    });

    test('will not mutate input objects', () => {
        const entityTest = {id: "1"};
        foo.normalize(entityTest, foo);
        expect(entityTest).toEqual({id: "1"});
    });

    test('will collect schemas that were used', () => {
        const entityTest = {id: '1', bar: {id: '2', foo: {id: '3'}}};
        expect(Object.keys(baz.normalize(entityTest, baz).schemas)).toEqual(['foo', 'bar', 'baz']);
    });

    test('will not try to normalize numbers or strings', () => {
        const schema = new EntitySchema('foo', {shape: new ObjectSchema({})});
        expect(schema.normalize('1', {})).toEqual({
            entities: {},
            schemas: {},
            result: '1'
        });
        expect(schema.normalize(2, {})).toEqual({
            entities: {},
            schemas: {},
            result: '2'
        });
    });

    test('will throw an error if an entity doesnt have and id', () => {
        const schema = new EntitySchema('foo', {shape: new ObjectSchema({})});
        expect(() => schema.normalize({}, {})).toThrow(UndefinedIdError('foo'));
    });

    test('will call merge on definition when an entity already exists', () => {
        const merge = jest.fn();
        const entities = {foo: {a: {id: 'a', name: 'first'}}};
        const schema = new EntitySchema('foo', {shape: new ObjectSchema({}, {
            merge
        })});

        schema.normalize({id: 'a', name: 'second'}, entities);
        expect(merge).toHaveBeenCalledWith(
            {id: 'a', name: 'first'},
            {id: 'a', name: 'second'}
        );
    });

    test('will not normalize null definitions', () => {
        const NullSchemaEntity = new EntitySchema('foo');
        expect(() => NullSchemaEntity.normalize({id: 'foo'}, {})).toThrow(/normalize.*foo/);
    });
});


describe('EntitySchema.denormalize', () => {

    test('can denormalize entities', () => {
        const entities = {
            foo: {
                "1": {id: "1"}
            }
        };

        expect(foo.denormalize({result: "1", entities})).toEqual({id: "1"});
    });

    test('will not cause an infinite recursion', () => {
        const foo = new EntitySchema('foo');
        const bar = new EntitySchema('bar');

        foo.shape = new ObjectSchema({bar});
        bar.shape = new ObjectSchema({foo});

        const entities = {
            bar: {"1": {id: "1", foo: "1"}},
            foo: {"1": {id: "1", bar: "1"}}
        };

        expect(bar.denormalize({result: "1", entities})).toEqual({
            id: "1",
            foo: {
                id: "1",
                bar: {
                    id: "1",
                    foo: "1"
                }
            }
        });
    });

    test('will not denormalize null entities', () => {
        const entities = {
            bar: {"1": {id: "1", foo: null}}
        };

        expect(bar.denormalize({result: "2", entities})).toEqual(undefined);
    });



});


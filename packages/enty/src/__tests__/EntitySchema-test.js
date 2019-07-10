//@flow
import EntitySchema from '../EntitySchema';
import ObjectSchema from '../ObjectSchema';
import {DELETED_ENTITY} from '../util/SchemaConstant';
import {NoDefinitionError} from '../util/Error';
import {UndefinedIdError} from '../util/Error';

var foo = EntitySchema('foo');
var bar = EntitySchema('bar');
var baz = EntitySchema('baz');

foo.set(ObjectSchema({}));
baz.set(ObjectSchema({bar}));
bar.set(ObjectSchema({foo}));


describe('EntitySchema.constructor', () => {

    test('EntitySchema can set definition through the `set` method', () => {
        var schema = EntitySchema('foo');
        const definition = ObjectSchema({bar: "1"});
        schema.set(definition);
        expect(schema.definition).toBe(definition);
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
        const schema = EntitySchema('foo').set(ObjectSchema({}));
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
        const schema = EntitySchema('foo').set(ObjectSchema({}));
        expect(() => schema.normalize({}, {})).toThrow(UndefinedIdError('foo'));
    });

    test('will call merge on definition when an entity already exists', () => {
        const merge = jest.fn();
        const entities = {foo: {a: {id: 'a', name: 'first'}}};
        const schema = EntitySchema('foo').set(ObjectSchema({}, {
            merge
        }));

        schema.normalize({id: 'a', name: 'second'}, entities);
        expect(merge).toHaveBeenCalledWith(
            {id: 'a', name: 'first'},
            {id: 'a', name: 'second'}
        );
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
        const foo = EntitySchema('foo');
        const bar = EntitySchema('bar');

        foo.set(ObjectSchema({bar}));
        bar.set(ObjectSchema({foo}));

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

    test('will not denormalize null definitions', () => {
        const NullSchemaEnitity = EntitySchema('foo');
        // $FlowFixMe - deliberate misuse of types for testing
        const NullDefinitionEnitity = EntitySchema('bar').set(null);

        expect(() => NullSchemaEnitity.normalize({}, {}))
            .toThrow(NoDefinitionError('foo'));

        expect(() => NullDefinitionEnitity.normalize({}, {}))
            .toThrow(NoDefinitionError('bar'));

    });


    test('will return DELETED_ENTITY placeholder if denormalizeFilter fails', () => {
        const entities = {
            foo: {
                "1": {id: "1", deleted: true}
            }
        };

        expect(foo.denormalize({result: "1", entities})).toEqual(DELETED_ENTITY);
    });

});


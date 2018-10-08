//@flow
import EntitySchema from '../EntitySchema';
import ObjectSchema from '../ObjectSchema';
import {DELETED_ENTITY} from '../util/SchemaConstant';
import {NoDefinitionError} from '../util/Error';

var foo = EntitySchema('foo');
var bar = EntitySchema('bar');
var baz = EntitySchema('baz');

foo.set(ObjectSchema({}));
baz.set(ObjectSchema({bar}));
bar.set(ObjectSchema({foo}));

test('EntitySchema can set definition through the `set` method', () => {
    var schema = EntitySchema('foo');
    const definition = ObjectSchema({bar: "1"});
    schema.set(definition);
    expect(schema.definition).toBe(definition);
});


test('EntitySchema can normalize entities', () => {
    const {entities, result} = foo.normalize({id: "1"});
    expect(result).toBe("1");
    expect(entities.foo["1"]).toEqual({id: "1"});
});

test('EntitySchema can denormalize entities', () => {
    const entities = {
        foo: {
            "1": {id: "1"}
        }
    };

    expect(foo.denormalize({result: "1", entities})).toEqual({id: "1"});
});

test('EntitySchema will not cause an infinite recursion', () => {
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

test('EntitySchema will not denormalize null entities', () => {
    const entities = {
        bar: {"1": {id: "1", foo: null}}
    };

    expect(bar.denormalize({result: "2", entities})).toEqual(undefined);
});

test('will not denormalize null definitions', () => {
    const NullSchemaEnitity = EntitySchema('foo');
    // $FlowFixMe - deliberate misuse of types for testing
    const NullDefinitionEnitity = EntitySchema('bar').set(null);

    const nullSchemaError = expect(() => NullSchemaEnitity.normalize({}, {}))
        .toThrow(NoDefinitionError('foo'));

    const nullDefinitionError = expect(() => NullDefinitionEnitity.normalize({}, {}))
        .toThrow(NoDefinitionError('bar'));

});



test('EntitySchema will return DELETED_ENTITY placeholder if denormalizeFilter fails', () => {
    const entities = {
        foo: {
            "1": {id: "1", deleted: true}
        }
    };

    expect(foo.denormalize({result: "1", entities})).toEqual(DELETED_ENTITY);
});


test('EntitySchema will not mutate input objects', () => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    expect(entityTest).toEqual({id: "1"});
});


test('EntitySchema can construct objects', () => {
    const entityTest = {id: "1"};
    foo.normalize(entityTest, foo);
    expect(entityTest).toEqual({id: "1"});
});


test('EntitySchema will collect schemas that were used', () => {
    const entityTest = {id: '1', bar: {id: '2', foo: {id: '3'}}};
    expect(Object.keys(baz.normalize(entityTest, baz).schemas)).toEqual(['foo', 'bar', 'baz']);
});




import EntitySchema from '../EntitySchema';
import ArraySchema from '../ArraySchema';
import ObjectSchema from '../ObjectSchema';
import REMOVED_ENTITY from '../util/RemovedEntity';

const foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

test('ArraySchema can normalize arrays', () => {
    const schema = new ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: '1'}, {id: '2'}]);

    expect(entities.foo['1']).toEqual({id: '1'});
    expect(entities.foo['2']).toEqual({id: '2'});
    expect(result).toEqual(['1', '2']);
});

test('ArraySchema can normalize Lists', () => {
    const schema = new ArraySchema(foo);
    const {entities, result} = schema.normalize([{id: '1'}, {id: '2'}]);

    expect(entities.foo['1']).toEqual({id: '1'});
    expect(entities.foo['2']).toEqual({id: '2'});
    expect(result).toEqual(['1', '2']);
});

test('ArraySchema can normalize nested things in arrays', () => {
    const schema = new ArraySchema(new ObjectSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: '1'}}]);

    expect(result).toEqual([{foo: '1'}]);
    expect(entities.foo['1']).toEqual({id: '1'});
});

test('ArraySchema can denormalize arrays', () => {
    const schema = new ArraySchema(foo);
    const entities = {
        foo: {
            '1': {id: '1'},
            '2': {id: '2'}
        }
    };
    expect(schema.denormalize({result: ['1', '2'], entities})).toEqual([{id: '1'}, {id: '2'}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('ArraySchema will not return deleted entities', () => {
    const schema = new ArraySchema(foo);
    const entities = {
        foo: {
            '1': {id: '1'},
            '2': {id: '2'},
            '3': REMOVED_ENTITY
        }
    };
    expect(schema.denormalize({result: ['1', '2', '3'], entities})).toEqual([{id: '1'}, {id: '2'}]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('ArraySchema will not try to denormalize null values', () => {
    const schema = new ArraySchema(foo);
    expect(schema.denormalize({result: null, entities: {}})).toEqual(null);
});

test('ArraySchema will not mutate input objects', () => {
    const schema = new ArraySchema(foo);
    const arrayTest = [{id: '1'}];

    schema.normalize(arrayTest);
    expect(arrayTest).toEqual([{id: '1'}]);
});

it('will default replace array on merge', () => {
    const foo = new EntitySchema('foo');
    const schema = new ArraySchema(foo);

    expect(schema.merge([1, 2, 3], [4, 5, 6])).toEqual([4, 5, 6]);
});

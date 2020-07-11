import {EntitySchema} from 'enty';
import ListSchema from '../ListSchema';
import MapSchema from '../MapSchema';
import {fromJS} from 'immutable';
import {List} from 'immutable';
import REMOVED_ENTITY from 'enty/lib/util/RemovedEntity';

const foo = new EntitySchema('foo', {shape: new MapSchema({})});

test('ListSchema can normalize arrays', () => {
    const schema = new ListSchema(foo);
    const {entities, result} = schema.normalize([{id: '1'}, {id: '2'}]);

    expect(entities.foo['1'].toJS()).toEqual({id: '1'});
    expect(entities.foo['2'].toJS()).toEqual({id: '2'});
    expect(result.toJS()).toEqual(['1', '2']);
});

test('ListSchema can normalize Lists', () => {
    const schema = new ListSchema(foo);
    const {entities, result} = schema.normalize(fromJS([{id: '1'}, {id: '2'}]));

    expect(entities.foo['1'].toJS()).toEqual({id: '1'});
    expect(entities.foo['2'].toJS()).toEqual({id: '2'});
    expect(result.toJS()).toEqual(['1', '2']);
});

test('ListSchema can normalize nested things in arrays', () => {
    const schema = new ListSchema(new MapSchema({foo}));
    const {entities, result} = schema.normalize([{foo: {id: '1'}}]);

    expect(result.toJS()).toEqual([{foo: '1'}]);
    expect(entities.foo['1'].toJS()).toEqual({id: '1'});
});

test('ListSchema can denormalize arrays', () => {
    const schema = new ListSchema(foo);
    const entities = fromJS({
        foo: {
            '1': {id: '1'},
            '2': {id: '2'}
        }
    });
    expect(schema.denormalize({result: ['1', '2'], entities}).map((ii) => ii.toJS())).toEqual([
        {id: '1'},
        {id: '2'}
    ]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('ListSchema will not return deleted entities', () => {
    const schema = new ListSchema(foo);
    const entities = fromJS({
        foo: {
            '1': {id: '1'},
            '2': {id: '2'},
            '3': REMOVED_ENTITY
        }
    });
    expect(schema.denormalize({result: ['1', '2', '3'], entities}).map((ii) => ii.toJS())).toEqual([
        {id: '1'},
        {id: '2'}
    ]);

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

test('ListSchema will not try to denormalize null values', () => {
    const schema = new ListSchema(foo);
    expect(schema.denormalize({result: null, entities: {}})).toEqual(null);
});

test('ListSchema will not mutate input objects', () => {
    const schema = new ListSchema(foo);
    const arrayTest = [{id: '1'}];

    schema.normalize(arrayTest);
    expect(arrayTest).toEqual([{id: '1'}]);
});

test('ListSchema can merge lists by replacing the previous with the next', () => {
    const schema = new ListSchema(foo);
    expect(List([2]).equals(schema.merge(List([1]), List([2])))).toBe(true);
});

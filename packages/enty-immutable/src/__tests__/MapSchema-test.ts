import {expect, describe, it} from '@jest/globals';
import {EntitySchema} from 'enty';
import MapSchema from '../MapSchema';
import {Map} from 'immutable';
import REMOVED_ENTITY from 'enty/lib/util/RemovedEntity';

const foo = new EntitySchema('foo', {shape: new MapSchema({})});

describe('MapSchema.options', () => {
    it('constructor will return a map', () => {
        const data = {first: 'foo', last: 'bar'};
        const {result} = new MapSchema({}).normalize(data);
        expect(result).toBeInstanceOf(Map);
        expect(result.equals(Map(data))).toBe(true);
    });

    it('merge will merge two maps', () => {
        const schema = new EntitySchema('foo', {shape: new MapSchema({})});
        const stateA = schema.normalize({id: 'a', first: 'foo'}, {});
        const stateB = schema.normalize({id: 'a', last: 'bar'}, stateA.entities);
        expect(stateB.entities.foo.a).toEqual(Map({id: 'a', first: 'foo', last: 'bar'}));
    });
});

// Copy from Object Schema tests. Probably redundant.

it('MapSchema can normalize objects', () => {
    const schema = new MapSchema({foo});
    let {entities, result} = schema.normalize({foo: {id: '1'}});

    expect(result).toEqual(Map({foo: '1'}));
    expect(entities.foo['1']).toEqual(Map({id: '1'}));
});

it('MapSchema can normalize maps', () => {
    const schema = new MapSchema({foo});
    let {entities, result} = schema.normalize(Map({foo: {id: '1'}}));

    expect(result).toEqual(Map({foo: '1'}));
    expect(entities.foo['1']).toEqual(Map({id: '1'}));
});

it('MapSchema.denormalize is the inverse of MapSchema.normalize', () => {
    const schema = new MapSchema({foo});
    const data = Map({foo: Map({id: '1'})});
    const output = schema.denormalize(schema.normalize(data));
    expect(data.equals(output)).toBe(true);
});

it('MapSchema can normalize empty objects', () => {
    const schema = new MapSchema({foo});
    let {entities, result} = schema.normalize({bar: {}});

    expect(entities).toEqual({});
    expect(result.toJS()).toEqual({bar: {}});
});

it('MapSchema can denormalize objects', () => {
    const schema = new MapSchema({foo});

    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({result: Map({foo: '1'}), entities})).toEqual(Map({foo: {id: '1'}}));
});

it('MapSchema will not denormalize null values', () => {
    const schema = new MapSchema({foo});

    const entities = {
        foo: {
            '1': {id: '1'}
        }
    };

    expect(schema.denormalize({result: null, entities})).toEqual(null);
});

it('MapSchema will not denormalize unknown keys', () => {
    const schema = new MapSchema({foo});

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

it('MapSchema will filter out REMOVED_ENTITY keys', () => {
    const schema = new MapSchema({foo});

    const entities = {
        foo: {
            '1': REMOVED_ENTITY
        }
    };

    expect(schema.denormalize({result: Map({foo: '1'}), entities})).toEqual(Map());
});

it('MapSchema will not mutate input objects', () => {
    const schema = new MapSchema({foo});
    const objectTest = {foo: {id: '1'}};

    schema.normalize(objectTest, {});

    expect(objectTest).toEqual({foo: {id: '1'}});
});

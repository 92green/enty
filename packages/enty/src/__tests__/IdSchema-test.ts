import {expect, it} from '@jest/globals';
import EntitySchema from '../EntitySchema';
import ObjectSchema from '../ObjectSchema';
import IdSchema from '../IdSchema';

const foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

const fooValues = new ObjectSchema({
    foo: new IdSchema(foo)
});

it('denormalize is almost the inverse of normalize', () => {
    const data = {foo: '1'};
    expect(data.foo).toEqual(fooValues.denormalize(fooValues.normalize(data)).foo.id);
});

it('normalize', () => {
    const data = {id: '1'};
    const entities = {
        foo: {
            '1': data
        }
    };
    expect(data).toEqual(new IdSchema(foo).normalize('1', entities).entities.foo['1']);
    expect(data).toEqual(new IdSchema(foo).normalize('1', undefined).entities.foo['1']);
});

it('denormalize', () => {
    const fooValue = new IdSchema(foo);
    const data = {id: '1'};
    const entities = {
        foo: {
            '1': data
        }
    };
    expect(data).toEqual(fooValue.denormalize({result: '1', entities}));
    expect(data).toEqual(fooValue.denormalize({result: '1', entities}, undefined));
});

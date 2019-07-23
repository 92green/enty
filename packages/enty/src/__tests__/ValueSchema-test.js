//@flow
import EntitySchema from '../EntitySchema';
import ObjectSchema from '../ObjectSchema';
import ValueSchema from '../ValueSchema';

const foo = new EntitySchema('foo', {
    shape: new ObjectSchema({})
});

const fooValues = new ObjectSchema({
    foo: new ValueSchema(foo)
});



test('denormalize is almost the inverse of normalize', () => {
    const data = {foo: '1'};
    expect(data.foo).toEqual(fooValues.denormalize(fooValues.normalize(data)).foo.id);
});

test('normalize', () => {
    const data = {id: '1'};
    const entities = {
        foo: {
            "1": data
        }
    };
    expect(data).toEqual(new ValueSchema(foo).normalize('1', entities).entities.foo['1']);
    expect(data).toEqual(new ValueSchema(foo).normalize('1', undefined).entities.foo['1']);
});

test('denormalize', () => {
    const fooValue = new ValueSchema(foo);
    const data = {id: '1'};
    const entities = {
        foo: {
            "1": data
        }
    };
    expect(data).toEqual(fooValue.denormalize({result: '1', entities}));
    expect(data).toEqual(fooValue.denormalize({result: '1', entities}, undefined));
});


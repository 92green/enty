import test from 'ava';
import {EntitySchema, ArraySchema, ObjectSchema} from '../../index';
import {fromJS} from 'immutable';

const foo = EntitySchema('foo');

test('ArraySchema can normalize arrays', tt => {
    const schema = ArraySchema(foo);
    tt.deepEqual(
        schema.normalize([{id: 1}, {id: 2}]),
        {
            entities: {
                foo: {
                    "1": {id: 1},
                    "2": {id: 2}
                }
            },
            result: [1, 2]
        }
    );
});


test('ArraySchema can normalize nested things in arrays', tt => {
    const schema = ArraySchema(ObjectSchema({foo}));
    tt.deepEqual(
        schema.normalize([{foo: {id: 1}}]),
        {
            entities: {
                foo: {
                    "1": {id: 1}
                }
            },
            result: [{foo: 1}]
        }
    );
});


test('ArraySchema can denormalize arrays', tt => {
    const schema = ArraySchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: 1},
            "2": {id: 2}
        }
    });
    tt.deepEqual(
        schema.denormalize(["1", "2"], entities).map(ii => ii.toJS()),
        [{id: 1}, {id: 2}]
    );

    tt.deepEqual(schema.denormalize(null, entities), null);
});


test('ArraySchema will not return deleted entities', tt => {
    const schema = ArraySchema(foo);
    const entities = fromJS({
        foo: {
            "1": {id: 1},
            "2": {id: 2},
            "3": {id: 3, deleted: true}
        }
    });
    tt.deepEqual(
        schema.denormalize(["1", "2", "3"], entities).map(ii => ii.toJS()),
        [{id: 1}, {id: 2}]
    );

    tt.deepEqual(schema.denormalize(null, entities), null);
});


test('ArraySchema will not try to denormalize null values', tt => {
    const schema = ArraySchema(foo);
    tt.deepEqual(schema.denormalize(null, {}), null);
});


test('ArraySchema will not mutate input objects', tt => {

    const schema = ArraySchema(foo);
    const arrayTest = [{id: 1}];

    schema.normalize(arrayTest);
    tt.deepEqual(arrayTest, [{id: 1}]);
});



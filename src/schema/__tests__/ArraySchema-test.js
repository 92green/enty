import test from 'ava';
import {EntitySchema, ArraySchema, ObjectSchema} from '../../index';

const foo = EntitySchema('foo');

//
// Arrays

test('Normalize can normalize arrays', tt => {
    const schema = ArraySchema(foo);
    tt.deepEqual(
        schema.normalize([{id: 1}, {id: 2}], schema),
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


test('Normalize can normalize nested things in arrays', tt => {
    const schema = ArraySchema(ObjectSchema({foo}));
    tt.deepEqual(
        schema.normalize([{foo: {id: 1}}], schema),
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




test('Normalize will not mutate input objects', tt => {

    const schema = ArraySchema(foo);
    const arrayTest = [{id: 1}];

    schema.normalize(arrayTest, schema);
    tt.deepEqual(arrayTest, [{id: 1}]);
});



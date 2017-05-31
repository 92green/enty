import test from 'ava';
import {EntitySchema, ObjectSchema} from '../../index';


var foo = EntitySchema('foo');

test('Normalize can normalize objects', tt => {
    const schema = ObjectSchema({foo});
    tt.deepEqual(
        schema.normalize({foo: {id: 1}}, schema),
        {
            entities: {
                foo: {
                    "1": {id: 1}
                }
            },
            result: {foo: 1}
        }
    );

    tt.deepEqual(
        schema.normalize({bar: {}}, schema),
        {
            entities: {},
            result: {bar: {}}
        }
    );
});

test('Normalize will not mutate input objects', tt => {
    const foo = EntitySchema('foo');
    const schema = ObjectSchema({foo});
    const objectTest = {foo: {id: 1}};

    // release the mutations!
    schema.normalize(objectTest, schema);

    tt.deepEqual(objectTest, {foo: {id: 1}});
});



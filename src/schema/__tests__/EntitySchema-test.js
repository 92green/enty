import test from 'ava';
import {EntitySchema} from '../../index';


var foo = EntitySchema('foo');



test('Normalize can normalize entities', tt => {
    tt.deepEqual(
        foo.normalize({id: 1}, foo),
        {
            entities: {
                foo: {
                    "1": {id: 1}
                }
            },
            result: 1
        }
    );
});

test('Normalize can normalize entities children', tt => {
    const schema = EntitySchema('bar', {foo});
    tt.deepEqual(
        schema.normalize({id: 1, foo: {id: 1}}, schema),
        {
            entities: {
                bar: {"1": {id: 1, foo: 1}},
                foo: {"1": {id: 1}}
            },
            result: 1
        }
    );

    // null values are ignored
    tt.deepEqual(
        schema.normalize({id: 1, foo: null}, schema),
        {
            entities: {
                bar: {"1": {id: 1, foo: null}}
            },
            result: 1
        }
    );
});


test('Normalize will not mutate input objects', tt => {
    const entityTest = {id: 1};
    foo.normalize(entityTest, foo);
    tt.deepEqual(entityTest, {id: 1});
});



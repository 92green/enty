import test from 'ava';
import {EntitySchema, ArraySchema, ObjectSchema} from '../Schema';
import Normalize from '../Normalize';

var foo = new EntitySchema('foo');

//
// Arrays

test('Normalize can normalize arrays', tt => {
    tt.deepEqual(
        Normalize([{id: 1}, {id: 2}], new ArraySchema(foo)),
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
    tt.deepEqual(
        Normalize([{foo: {id: 1}}], new ArraySchema(new ObjectSchema({foo}))),
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


test('Normalize can normalize objects', tt => {
    tt.deepEqual(
        Normalize({foo: {id: 1}}, new ObjectSchema({foo})),
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
        Normalize({bar: {}}, new ObjectSchema({foo})),
        {
            entities: {},
            result: {bar: {}}
        }
    );
});


test('Normalize can normalize entities', tt => {
    tt.deepEqual(
        Normalize({id: 1}, foo),
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
    tt.deepEqual(
        Normalize({id: 1, foo: {id: 1}}, new EntitySchema('bar', {foo})),
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
        Normalize({id: 1, foo: null}, new EntitySchema('bar', {foo})),
        {
            entities: {
                bar: {"1": {id: 1, foo: null}}
            },
            result: 1
        }
    );
});

test('Normalize can regonize [] and {} as shorthand', tt => {
    tt.deepEqual(
        Normalize([{foo: {id: 1}}], [{foo}]),
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
    const subreddit = new EntitySchema('subreddit');
    const objectTest = {subreddit: {id: "MK"}};
    const arrayTest = [{id: "MK"}];
    const entityTest = {id: "MK"};

    // release the mutations!
    Normalize(entityTest, subreddit);
    Normalize(objectTest, {subreddit});
    Normalize(arrayTest, [subreddit]);


    tt.deepEqual(entityTest, {id: "MK"});
    tt.deepEqual(objectTest, {subreddit: {id: "MK"}});
    tt.deepEqual(arrayTest, [{id: "MK"}]);
});



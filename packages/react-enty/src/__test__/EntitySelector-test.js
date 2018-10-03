//@flow
import EntitySchema from 'enty/lib/EntitySchema';
import ObjectSchema from 'enty/lib/ObjectSchema';
import ArraySchema from 'enty/lib/ArraySchema';
import {fromJS, List, Map} from 'immutable';
import {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from '../EntitySelector';

import EntityReducerFactory from '../EntityReducerFactory';

var foo = EntitySchema('foo').set(ObjectSchema());
var fooList = ArraySchema(foo);

var schema = ObjectSchema({
    foo,
    fooList: ArraySchema(foo)
});

const reducer = EntityReducerFactory({schema});

function constructState(): * {
    return {
        entity: reducer(
            undefined,
            {
                type: 'FOO_RECEIVE',
                meta: {resultKey: 'FOO'},
                payload: {
                    foo: {id: 'qux'},
                    fooList: [{id: 'bar'}, {id: 'baz'}, {id: 'qux'}]
                }
            }
        )
    }

}


//
// selectEntityByResult()

test('selectEntityByResult() should return a map for single items', () => {
    const data = selectEntityByResult(constructState(), 'FOO');
    expect(data && data.foo).toBeTruthy();
});

test('selectEntityByResult() should return an array for indexed items', () => {
    const reducer = EntityReducerFactory({schema: fooList});
    const state = {entity: reducer(
        undefined,
        {
            type: 'FOOLIST_RECEIVE',
            meta: {resultKey: 'FOOLIST_RECEIVE'},
            payload: [{id: 'bar'}, {id: 'baz'}]
        }
    )};
    const data = selectEntityByResult(state, 'FOOLIST_RECEIVE');
    expect(data && data.length).toBe(2);
});

test('selectEntityByResult() should return nothing if the denormalize fails', () => {
    expect(selectEntityByResult({entity: fromJS({})}, 'ENTITY_RECEIVE')).toBe(undefined);
});


//
// selectEntityById()

test('selectEntityById() should return an item from entity state by path', () => {
    // $FlowFixMe
    expect(selectEntityById(constructState(), 'foo', 'bar').id).toBe('bar');
});

test('selectEntityById() will return undefined if there is no schema for type', () => {
    const data = selectEntityById(constructState(), 'blerge', 'bar');
    expect(data).toBe(undefined);
});



//
// selectEntityByType()

test('selectEntityByType() should return an array of entities', () => {
    const data = selectEntityByType(constructState(), 'foo');
    expect(data).toEqual([
        {id: 'qux'},
        {id: 'bar'},
        {id: 'baz'}
    ]);
});



//@flow
import test from 'ava';
import EntitySchema from '../schema/EntitySchema';
import ObjectSchema from '../schema/ObjectSchema';
import ArraySchema from '../schema/ArraySchema';
import {fromJS, List, Map} from 'immutable';
import {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from '../EntitySelector';

function constructState(): Object {
    var foo = EntitySchema('foo');
    var fooList = ArraySchema(foo);
    var schema = ObjectSchema({
        fooList: ArraySchema(foo),
        foo,
        single: ObjectSchema({foo})
    });
    var normalized = schema.normalize(
        {
            single: {foo: {id: 'qux'}},
            fooList: [{id: 'bar'}, {id: 'baz'}, {id: 'qux'}]
        }
    );

    // console.log(JSON.stringify(normalized, null ,4));
    return {
        entity: fromJS({
            ...normalized.entities,
            _result: normalized.result,
            _schemas: normalized.schemas,
            _baseSchema: Map({
                ENTITY_RECEIVE: schema,
                fooList
            })
        })
    };
}


//
// selectEntityByResult()

test('selectEntityByResult() should return a map for single items', (tt: Object) => {
    tt.truthy(selectEntityByResult(constructState(), 'single').foo);
});

test('selectEntityByResult() should return an array for indexed items', (tt: Object) => {
    tt.is(selectEntityByResult(constructState(), 'fooList').length, 3);
});

test('selectEntityByResult() should return nothing if the denormalize fails', (tt: Object) => {
    tt.is(selectEntityByResult({entity: fromJS({})}, 'ENTITY_RECEIVE'), undefined);
});


//
// selectEntityById()

test('selectEntityById() should return an item from entity state by path', (tt: Object) => {
    tt.is(selectEntityById(constructState(), 'foo', 'bar').get('id'), 'bar');
});


//
// selectEntityByType()

test('selectEntityByType() should return an list of entities', (tt: Object) => {
    tt.true(List.isList(selectEntityByType(constructState(), 'foo')));
});



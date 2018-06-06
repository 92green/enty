//@flow
import test from 'ava';
import EntitySchema from 'enty/lib/EntitySchema';
import MapSchema from 'enty/lib/MapSchema';
import ListSchema from 'enty/lib/ListSchema';
import {fromJS, List, Map} from 'immutable';
import {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from '../EntitySelector';

function constructState(): Object {
    var foo = EntitySchema('foo').set(MapSchema());
    var fooList = ListSchema(foo);
    var schema = MapSchema({
        fooList: ListSchema(foo),
        foo,
        single: MapSchema({foo})
    });
    var normalized = schema.normalize(
        {
            single: {foo: {id: 'qux'}},
            fooList: [{id: 'bar'}, {id: 'baz'}, {id: 'qux'}]
        }
    );

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
    const data = selectEntityByResult(constructState(), 'single');
    tt.truthy(data && data.foo);
});

test('selectEntityByResult() should return an array for indexed items', (tt: Object) => {
    const data = selectEntityByResult(constructState(), 'fooList');
    tt.is(data && data.length, 3);
});

test('selectEntityByResult() should return nothing if the denormalize fails', (tt: Object) => {
    tt.is(selectEntityByResult({entity: fromJS({})}, 'ENTITY_RECEIVE'), undefined);
});


//
// selectEntityById()

test('selectEntityById() should return an item from entity state by path', (tt: Object) => {
    const data = selectEntityById(constructState(), 'foo', 'bar');
    tt.is(data && data.get('id'), 'bar');
});


//
// selectEntityByType()

test('selectEntityByType() should return an list of entities', (tt: Object) => {
    tt.true(List.isList(selectEntityByType(constructState(), 'foo')));
});



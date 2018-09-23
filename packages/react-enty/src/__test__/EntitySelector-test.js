//@flow
import EntitySchema from 'enty/lib/EntitySchema';
import MapSchema from 'enty/lib/MapSchema';
import ListSchema from 'enty/lib/ListSchema';
import {fromJS, List, Map} from 'immutable';
import {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from '../EntitySelector';

function constructState(): * {
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
            _baseSchema: schema
        })
    };
}


//
// selectEntityByResult()

test('selectEntityByResult() should return a map for single items', () => {
    const data = selectEntityByResult(constructState(), 'single');
    expect(data && data.foo).toBeTruthy();
});

test('selectEntityByResult() should return an array for indexed items', () => {
    const data = selectEntityByResult(constructState(), 'fooList');
    expect(data && data.length).toBe(3);
});

test('selectEntityByResult() should return nothing if the denormalize fails', () => {
    expect(selectEntityByResult({entity: fromJS({})}, 'ENTITY_RECEIVE')).toBe(undefined);
});


//
// selectEntityById()

test('selectEntityById() should return an item from entity state by path', () => {
    // $FlowFixMe
    expect(selectEntityById(constructState(), 'foo', 'bar').get('id')).toBe('bar');
});

test('selectEntityById() will return undefined if there is no schema for type', () => {
    const data = selectEntityById(constructState(), 'blerge', 'bar');
    expect(data).toBe(undefined);
});



//
// selectEntityByType()

test('selectEntityByType() should return an list of entities', () => {
    expect(List.isList(selectEntityByType(constructState(), 'foo'))).toBe(true);
});



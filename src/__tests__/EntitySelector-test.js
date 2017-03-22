import test from 'ava';
import {schema} from 'normalizr';
import {fromJS, List, Map} from 'immutable';
import {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from '../EntitySelector';
import {normalize} from 'normalizr';

function constructState() {
    var FooSchema = new schema.Entity('foo');
    var entitySchema = {
        fooList: [FooSchema],
        foo: FooSchema
    };
    var normalized = normalize(
        {
            single: {foo: {id: 'qux'}},
            fooList: [{id: 'bar'}, {id: 'baz'}, {id: 'qux', __deleted: true}]
        },
        entitySchema
    );

    return {
        entity: fromJS({
            ...normalized.entities,
            _result: normalized.result,
            _schema: Map({
                ENTITY_RECEIVE: entitySchema,
                otherSchema: entitySchema,
                fooList: entitySchema.fooList
            })
        })
    };
}


//
// selectEntityByResult()

test('selectEntityByResult() should return a map for single items', tt => {
    tt.truthy(selectEntityByResult(constructState(), 'single').foo);
});

test('selectEntityByResult() should return an array for indexed items', tt => {
    tt.is(selectEntityByResult(constructState(), 'fooList', 'fooList').length, 2);
});

test('selectEntityByResult() should return nothing if the denormalize fails', tt => {
    tt.is(selectEntityByResult({entity: fromJS({})}), undefined);
});

test('selectEntityByResult() will not return deleted items', tt => {
    tt.is(selectEntityByResult(constructState(), 'fooList', 'fooList').length, 2);
});


//
// selectEntityById()

test('selectEntityById() should return an item from entity state by path', tt => {
    tt.is(selectEntityById(constructState(), 'foo', 'bar', 'otherSchema').get('id'), 'bar');
});

test('selectEntityById() will not return deleted items', tt => {
    tt.is(selectEntityById(constructState(), 'foo', 'qux', 'otherSchema'), undefined);
});


//
// selectEntityByType()

test('selectEntityByType() should return an list of entities', tt => {
    tt.true(List.isList(selectEntityByType(constructState(), 'foo')));
});

test('selectEntityByType() will not return deleted items', tt => {
    tt.is(selectEntityByType(constructState(), 'foo').size, 2);
});



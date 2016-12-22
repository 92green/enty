import test from 'ava';
import {Schema, arrayOf} from 'normalizr';
import {fromJS} from 'immutable';
import {selectEntity, selectEntityByPath} from '../EntitySelector';
import {normalize} from 'normalizr';

function constructState() {
    var FooSchema = new Schema('foo');
    var entitySchema = {
        fooList: arrayOf(FooSchema),
        foo: FooSchema
    }
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
            _schema: {
                mainSchema: entitySchema,
                otherSchema: entitySchema,
                fooList: entitySchema.fooList
            }
        })
    }
}


//
// selectEntity()

test('selectEntity() should return a map for single items', tt => {
    tt.truthy(selectEntity(constructState(), 'single').foo);
});

test('selectEntity() should return an array for indexed items', tt => {
    tt.is(selectEntity(constructState(), 'fooList', 'fooList').length, 2);
});

test('selectEntity() should return nothing if the denormalize fails', tt => {
    tt.is(selectEntity({entity: fromJS({})}), undefined);
});

test('selectEntityByPath() will not return deleted items', tt => {
    tt.is(selectEntity(constructState(), 'fooList', 'fooList')[2], undefined);
});


//
// selectEntityByPath()

test('selectEntityByPath() should return an item from entity state by path', tt => {
    tt.is(selectEntityByPath(constructState(), ['foo', 'bar'], 'otherSchema').get('id'), 'bar');
});

test('selectEntityByPath() will not return deleted items', tt => {
    tt.is(selectEntityByPath(constructState(), ['foo', 'qux'], 'otherSchema'), undefined);
});


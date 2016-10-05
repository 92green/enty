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
            fooList: [{id: 'bar'}, {id: 'baz'}]
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


test('selectEntity', tt => {
    tt.truthy(selectEntity(constructState(), 'single').foo, 'it should return a map for single items');
    tt.is(selectEntity(constructState(), 'fooList', 'fooList').length, 2, 'it should return an array for indexed items');
    tt.is(selectEntity({entity: fromJS({})}), undefined, 'it should return nothing if the denormalize fails');
});

test('selectEntityByPath', tt => {
    tt.is(selectEntityByPath(constructState(), ['foo', 'bar'], 'otherSchema').get('id'), 'bar', 'it should an item from entity state by path');
});

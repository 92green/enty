import test from 'ava';
import {spy} from 'sinon';
import {fromJS} from 'immutable';
import {
    reduceActionMap,
    createRequestAction,
    createRequestActionSet
} from '../CreateRequestActions';



test('createRequestActionSet', tt => {
    var actions = createRequestActionSet({
        foo: {
            bar: () => {}
        }
    });

    tt.true(typeof actions.requestFooBar === 'function', 'should have an action creator');
    tt.is(actions.FOO_BAR_FETCH, 'FOO_BAR_FETCH', 'should have FETCH action type');
    tt.is(actions.FOO_BAR_RECEIVE, 'FOO_BAR_RECEIVE', 'should have RECIEVE action type');
    tt.is(actions.FOO_BAR_ERROR, 'FOO_BAR_ERROR', 'should have ERROR action type');
});



test('reduceActionMap', tt => {
    var actions = fromJS({
        foo: {
            bar: 'baz'
        }
    });

    tt.is(reduceActionMap(actions).get('FOO_BAR'), 'baz');
});

import test from 'ava';
import sinon from 'sinon';
import {fromJS} from 'immutable';
import {reduceActionMap, createRequestActionSet, createRequestAction} from '../CreateRequestActions';

const RESOLVE = () => Promise.resolve();
const REJECT = () => Promise.reject();
const PASS = ii => ii;

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



//
// createRequestAction

const getRequest = (side) => createRequestAction('FOO_FETCH', 'FOO_RECEIVE', 'FOO_ERROR', side);

test('createRequestAction returns a function', tt => {
    tt.is(typeof getRequest()(), 'function');
});

test('createRequestAction dispatches FETCH always', tt => {
    getRequest(RESOLVE)()(action => {
        tt.is(action.type, 'FOO_FETCH');
    });
});

test.todo('createRequestAction dispatches RECEIVE on resolve');
test('RECEIVE action resultKey defaults to RECEIVE action name', tt => {
    var dispatch = sinon.spy();
    return getRequest(RESOLVE)()(dispatch)
        .catch(() => {
            tt.is(dispatch.secondCall.args[0].type, 'FOO_RECEIVE');
        });
});

test.todo('createRequestAction dispatches ERROR on reject');
test('ERROR action resultKey defaults to ERROR action name', tt => {
    var dispatch = sinon.spy();
    return getRequest(REJECT)()(dispatch)
        .catch(() => {
            tt.is(dispatch.secondCall.args[0].type, 'FOO_ERROR');
        });
});

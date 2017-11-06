//@flow
import test from 'ava';
import sinon from 'sinon';
import EntityApi from '../EntityApi';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);

var actions = EntityApi({}, {
    resolve: RESOLVE,
    reject: REJECT,
    foo: {
        bar: () => {}
    }
});

test('createRequestActionSet', (t: Object) => {
    t.true(typeof actions.foo.bar === 'function', 'should have an action creator');
    t.is(actions.actionTypes.FOO_BAR_FETCH, 'FOO_BAR_FETCH', 'should have FETCH action type');
    t.is(actions.actionTypes.FOO_BAR_RECEIVE, 'FOO_BAR_RECEIVE', 'should have RECIEVE action type');
    t.is(actions.actionTypes.FOO_BAR_ERROR, 'FOO_BAR_ERROR', 'should have ERROR action type');
});


//
// createRequestAction

// const getRequest = (side) => createRequestAction('FOO_FETCH', 'FOO_RECEIVE', 'FOO_ERROR', side);

test('createRequestAction returns a function', (t: Object) => {
    t.is(typeof actions.resolve(), 'function');
});

test('createRequestAction dispatches FETCH always', (t: Object): Promise<any> => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE)(dispatch)
        .then(() => {
            t.is('RESOLVE_FETCH', dispatch.firstCall.args[0].type);
        });
});

test('RECEIVE action resultKey defaults to RECEIVE action name', (t: Object): Promise<any> => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE)(dispatch)
        .then(() => {
            t.is(dispatch.secondCall.args[0].type, 'RESOLVE_RECEIVE');
        });
});

test('ERROR action resultKey defaults to ERROR action name', (t: Object): Promise<any> => {
    var dispatch = sinon.spy();
    return actions.reject(REJECT)(dispatch)
        .then(() => {
            t.is('REJECT_ERROR', dispatch.secondCall.args[0].type);
        });
});

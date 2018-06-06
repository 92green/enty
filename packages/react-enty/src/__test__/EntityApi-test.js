//@flow
import test from 'ava';
import sinon from 'sinon';
import EntityApi from '../EntityApi';
import ObjectSchema from 'enty/lib/ObjectSchema';
import {createAllRequestAction} from '../EntityApi';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);

var actions = EntityApi(ObjectSchema({}), {
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

test('FETCH RECIEVE action will pass meta through', (t: Object): Promise<any> => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE, {foo: 'bar'})(dispatch)
        .then(() => {
            t.is('bar', dispatch.firstCall.args[0].meta.foo);
            t.is('bar', dispatch.secondCall.args[0].meta.foo);
        });
});

test('ERROR action will pass meta through', (t: Object): Promise<any> => {
    var dispatch = sinon.spy();
    return actions.reject(REJECT, {foo: 'bar'})(dispatch)
        .then(() => {
            t.is('bar', dispatch.secondCall.args[0].meta.foo);
        });
});


// Create Multi ActionCreator

test('createAllRequestAction will call all sideffects', (t: Object): Promise<any> => {
    var aa = sinon.spy();
    var bb = sinon.spy();

    return createAllRequestAction('a', 'a', 'a', [aa,bb])()(sinon.spy())
        .then(() => {
            t.is(aa.callCount, 1);
            t.is(bb.callCount, 1);
        })
});

test('createAllRequestAction will merge resulting objects', (t: Object): Promise<any> => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});

    return createAllRequestAction('a', 'a', 'a', [aa,bb])()(dd => dd)
        .then((data) => {
            t.deepEqual(data.payload, {aa: 'aa', bb: 'bb'});
        })
});

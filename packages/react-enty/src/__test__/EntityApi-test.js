//@flow
import sinon from 'sinon';
import {Map} from 'immutable';
import EntityApi from '../EntityApi';
import ObjectSchema from 'enty/lib/ObjectSchema';
import {createAllRequestAction} from '../EntityApi';
import {createRequestAction} from '../EntityApi';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);

var actions = EntityApi(ObjectSchema({}), {
    resolve: RESOLVE,
    reject: REJECT,
    foo: {
        bar: () => {}
    }
});

const getState = () => ({
    entity: Map()
});
const fakeAction = (sideEffect) => createRequestAction('fetch', 'receive', 'error', sideEffect);

test('createRequestActionSet', () => {
    expect(typeof actions.foo.bar.request === 'function').toBe(true);
});


//
// createRequestAction
test('createRequestAction returns a function', () => {
    expect(typeof actions.resolve.request).toBe('function');
});

test('createRequestAction dispatches FETCH always', () => {
    var dispatch = sinon.spy();
    return fakeAction(RESOLVE)()(dispatch, getState)
        .then(() => {
            expect(dispatch.firstCall.args[0].type).toBe('fetch');
        });
});

test('RECEIVE action resultKey defaults to RECEIVE action name', () => {
    var dispatch = sinon.spy();
    return fakeAction(RESOLVE)()(dispatch, getState)
        .then(() => {
            expect(dispatch.secondCall.args[0].type).toBe('receive');
        });
});

test('ERROR action resultKey defaults to ERROR action name', () => {
    var dispatch = sinon.spy();
    return fakeAction(REJECT)()(dispatch, getState)
        .catch(_ => _)
        .then(() => {
            expect(dispatch.secondCall.args[0].type).toBe('error');
        });
});

test('FETCH RECEIVE action will pass meta through', () => {
    var dispatch = sinon.spy();
    return fakeAction(RESOLVE)({}, {foo: 'bar'})(dispatch, getState)
        .then(() => {
            expect('bar').toBe(dispatch.firstCall.args[0].meta.foo);
            expect('bar').toBe(dispatch.secondCall.args[0].meta.foo);
        });
});

test('ERROR action will pass meta through', () => {
    var dispatch = sinon.spy();
    return fakeAction(REJECT)({}, {foo: 'bar'})(dispatch, getState)
        .catch(_ => _)
        .then(() => {
            expect('bar').toBe(dispatch.secondCall.args[0].meta.foo);
        });
});


// Create Multi ActionCreator

test('createAllRequestAction will call all sideffects', () => {
    var aa = sinon.spy();
    var bb = sinon.spy();

    return createAllRequestAction('a', 'a', 'a', [aa,bb])()(sinon.spy(), getState)
        .then(() => {
            expect(aa.callCount).toBe(1);
            expect(bb.callCount).toBe(1);
        });
});

test('createAllRequestAction will merge resulting objects', () => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});
    var dispatch = sinon.spy();

    return createAllRequestAction('a', 'a', 'a', [aa,bb])()(dispatch, getState)
        .then(() => {
            expect(null).toBe(dispatch.firstCall.args[0].payload);
            expect({aa: 'aa', bb: 'bb'}).toEqual(dispatch.secondCall.args[0].payload);
        });
});

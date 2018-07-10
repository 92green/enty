//@flow
import sinon from 'sinon';
import {Map} from 'immutable';
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

const getState = () => ({
    entity: Map()
})

test('createRequestActionSet', () => {
    expect(typeof actions.foo.bar === 'function').toBe(true);
    expect(actions.actionTypes.FOO_BAR_FETCH).toBe('FOO_BAR_FETCH');
    expect(actions.actionTypes.FOO_BAR_RECEIVE).toBe('FOO_BAR_RECEIVE');
    expect(actions.actionTypes.FOO_BAR_ERROR).toBe('FOO_BAR_ERROR');
});


//
// createRequestAction

// const getRequest = (side) => createRequestAction('FOO_FETCH', 'FOO_RECEIVE', 'FOO_ERROR', side);

test('createRequestAction returns a function', () => {
    expect(typeof actions.resolve()).toBe('function');
});

test('createRequestAction dispatches FETCH always', () => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE)(dispatch, getState)
        .then(() => {
            expect('RESOLVE_FETCH').toBe(dispatch.firstCall.args[0].type);
        });
});

test('RECEIVE action resultKey defaults to RECEIVE action name', () => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE)(dispatch, getState)
        .then(() => {
            expect(dispatch.secondCall.args[0].type).toBe('RESOLVE_RECEIVE');
        });
});

test('ERROR action resultKey defaults to ERROR action name', () => {
    var dispatch = sinon.spy();
    return actions.reject(REJECT)(dispatch, getState)
        .catch(_ => _)
        .then(() => {
            expect('REJECT_ERROR').toBe(dispatch.secondCall.args[0].type);
        });
});

test('FETCH RECIEVE action will pass meta through', () => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE, {foo: 'bar'})(dispatch, getState)
        .then(() => {
            expect('bar').toBe(dispatch.firstCall.args[0].meta.foo);
            expect('bar').toBe(dispatch.secondCall.args[0].meta.foo);
        });
});

test('ERROR action will pass meta through', () => {
    var dispatch = sinon.spy();
    return actions.reject(REJECT, {foo: 'bar'})(dispatch, getState)
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

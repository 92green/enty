import test from 'ava';
import sinon from 'sinon';
import {fromJS} from 'immutable';
import EntityApi from '../EntityApi';

const RESOLVE = () => Promise.resolve();
const REJECT = () => Promise.reject();

var actions = EntityApi({
    resolve: RESOLVE,
    reject: REJECT,
    foo: {
        bar: () => {}
    }
});

test('createRequestActionSet', tt => {

    tt.true(typeof actions.foo.bar === 'function', 'should have an action creator');
    tt.is(actions.actionTypes.FOO_BAR_FETCH, 'FOO_BAR_FETCH', 'should have FETCH action type');
    tt.is(actions.actionTypes.FOO_BAR_RECEIVE, 'FOO_BAR_RECEIVE', 'should have RECIEVE action type');
    tt.is(actions.actionTypes.FOO_BAR_ERROR, 'FOO_BAR_ERROR', 'should have ERROR action type');
});

// test('reduceActionMap', tt => {
//     var actions = fromJS({
//         foo: {
//             bar: 'baz'
//         }
//     });

//     tt.is(reduceActionMap(actions).get('FOO_BAR'), 'baz');
// });



//
// createRequestAction

// const getRequest = (side) => createRequestAction('FOO_FETCH', 'FOO_RECEIVE', 'FOO_ERROR', side);

test('createRequestAction returns a function', tt => {
    tt.is(typeof actions.resolve(), 'function');
});

test('createRequestAction dispatches FETCH always', tt => {
    actions.resolve(action => {
        tt.is(action.type, 'RESOLVE_FETCH');
    });
});

test('RECEIVE action resultKey defaults to RECEIVE action name', tt => {
    var dispatch = sinon.spy();
    return actions.resolve(RESOLVE)(dispatch)
        .catch(() => {
            tt.is(dispatch.secondCall.args[0].type, 'RESOLVE_RECEIVE');
        });
});

test('ERROR action resultKey defaults to ERROR action name', tt => {
    var dispatch = sinon.spy();
    return actions.reject(REJECT)(dispatch)
        .catch(() => {
            tt.is('REJECT_ERROR', dispatch.secondCall.args[0].type);
        });
});

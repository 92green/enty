// @flow
import type {HockMeta} from '../util/definitions';

import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {fake} from 'sinon';
import {stub} from 'sinon';
import {fromJS} from 'immutable';
import RequestHockFactory from '../RequestHockFactory';
import {FetchingState} from '../RequestState';
import {EmptyState} from '../RequestState';
import {RefetchingState} from '../RequestState';
import {ErrorState} from '../RequestState';
import {SuccessState} from '../RequestState';
import Message from '../data/Message';
import {RequestHockNoNameError} from '../util/Error';

const proxyquire = require('proxyquire').noCallThru();

const noop = () => {};
const identity = (aa) => aa;
const resolve = (x) => () => Promise.resolve(x);
const reject = (x) => () => Promise.reject(x);

var STORE = {
    subscribe: () => {},
    dispatch: (aa) => aa,
    getState: () => ({
        entity: fromJS({
            _requestState: {
                foo: FetchingState()
            }
        })
    })
};

const hockMeta: HockMeta = {
    generateResultKey: props => `${props}-resultKey`,
    requestActionName: 'FooAction'
}

const queryCreator = () => `query`;
const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
const RequestHockApplier = RequestHock({name: 'foo'});

test('will return a function', t => {
    t.is(typeof RequestHock, 'function');
});

test('hockApplier should be a function', t => {
    t.is(typeof RequestHockApplier, 'function');
});

test('will throw an error is config.name is not supplied', t => {
    const requestHockError = t.throws(() => RequestHock({})(() => null));
    t.deepEqual(RequestHockNoNameError('FooAction'), requestHockError);
});


test('hocked component will be given and Message to props.[name]', t => {
    const Child = RequestHockApplier((props) => {
        t.true(props.foo instanceof Message);
        return null;
    });

    const component = shallow(<Child store={STORE}/>).dive().dive();
});


test.cb('Message.onRequest will dispatch an action', t => {
    t.plan(1);
    const store = {
        subscribe: () => {},
        getState: STORE.getState,
        dispatch: payload => {
            t.pass()
            t.end()
        }
    };

    const Child = RequestHockApplier((props) => {
        props.foo.onRequest()
        return null;
    });

    const component = shallow(<Child store={store}/>).dive().dive();
});


test('will only use a new response key once a request as returned', t => {
    const EmptySpy = spy();
    const FetchingSpy = spy();
    const RefetchingSpy = spy();
    const ErrorSpy = spy();
    const SuccessSpy = spy();

    const hock = (requestState, selectEntityByResult) => {
        const RequestHockFactory = proxyquire('../RequestHockFactory', {
            './EntitySelector': {
                selectEntityByResult
            },
            './RequestStateSelector': () => requestState
        }).default;

        const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
        const RequestHockApplier = RequestHock({name: 'foo', resultKey: 'bar'});
        const Child = RequestHockApplier((props) => {
            return null;
        });
        shallow(<Child store={STORE}/>).dive()
            .setProps({
                foo: {
                    request: fake(),
                    resultKey: 'foo',
                    nextResultKey: 'bar'
                }
            })
    };

    hock(EmptyState(), EmptySpy);
    hock(FetchingState(), FetchingSpy);
    hock(RefetchingState(), RefetchingSpy);
    hock(ErrorState(), ErrorSpy);
    hock(SuccessState(), SuccessSpy);

    t.is(EmptySpy.args[1][1], 'foo');
    t.is(FetchingSpy.args[1][1], 'foo');
    t.is(RefetchingSpy.args[1][1], 'foo');
    t.is(ErrorSpy.args[1][1], 'bar');
    t.is(SuccessSpy.args[1][1], 'bar');
});


test('will strip errors out of requestStates', t => {
    const RequestHockFactory = proxyquire('../RequestHockFactory', {
            './EntitySelector': {
                selectEntityByResult: spy()
            },
            './RequestStateSelector': () => ErrorState({message: 'error!'})
        }).default;

    const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
    const RequestHockApplier = RequestHock({name: 'foo'});
    const Child = RequestHockApplier((props) => {
        props.foo.requestState.errorMap(data => t.is(data, null));
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
});



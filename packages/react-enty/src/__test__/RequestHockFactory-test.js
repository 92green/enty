// @flow
import type {HockMeta} from '../util/definitions';

import React from 'react';
import {fromJS} from 'immutable';
import RequestHockFactory from '../RequestHockFactory';
import * as EntitySelector from '../EntitySelector';
import RequestStateSelector from '../RequestStateSelector';
import {FetchingState} from '../RequestState';
import {EmptyState} from '../RequestState';
import {RefetchingState} from '../RequestState';
import {ErrorState} from '../RequestState';
import {SuccessState} from '../RequestState';
import * as RequestState from '../RequestState';
import Message from '../data/Message';
import {RequestHockNoNameError} from '../util/Error';

import {configure} from 'enzyme';
import {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

jest.mock('../RequestStateSelector');



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

beforeEach(() => {
    RequestStateSelector.mockReset();
})

test('will return a function', () => {
    expect(typeof RequestHock).toBe('function');
});

test('hockApplier should be a function', () => {
    expect(typeof RequestHockApplier).toBe('function');
});

test('will throw an error is config.name is not supplied', () => {
    expect(() => RequestHock({})(() => null))
        .toThrow(RequestHockNoNameError('FooAction'));
});

test('config.payloadCreator will by default be an identity function', () => {
    RequestStateSelector.mockReturnValue(EmptyState());

    const actionCreator = jest.fn();
    const RequestHock = RequestHockFactory(actionCreator, hockMeta);
    const RequestHockApplier = RequestHock({name: 'foo'});
    const Child = RequestHockApplier((props) => {
        props.foo.onRequest('foo');
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
    expect(actionCreator).toHaveBeenCalledWith('foo', {resultKey: 'foo-resultKey'});
});

test('config.payloadCreator will create the payload', () => {
    RequestStateSelector.mockReturnValue(EmptyState());
    const actionCreator = jest.fn();
    const RequestHock = RequestHockFactory(actionCreator, hockMeta);
    const RequestHockApplier = RequestHock({name: 'foo', payloadCreator: () => 'bar'});
    const Child = RequestHockApplier((props) => {
        props.foo.onRequest('foo');
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
    expect(actionCreator).not.toHaveBeenCalledWith('foo', {resultKey: 'foo-resultKey'});
});

test('config.updateResultKey will by default be an identity function', () => {
    RequestStateSelector.mockReturnValue(EmptyState());
    const actionCreator = jest.fn();
    const RequestHock = RequestHockFactory(actionCreator, {...hockMeta, generateResultKey: () => 'fooResultKey'});
    const RequestHockApplier = RequestHock({name: 'foo'});
    const Child = RequestHockApplier((props) => {
        props.foo.onRequest();
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
    expect(actionCreator).toHaveBeenCalledWith(undefined, {resultKey: 'fooResultKey'});
});

test('config.updateResultKey will update the resultKey', () => {
    RequestStateSelector.mockReturnValue(EmptyState());
    const actionCreator = jest.fn();
    const RequestHock = RequestHockFactory(actionCreator, {...hockMeta, generateResultKey: () => 'fooResultKey'});
    const RequestHockApplier = RequestHock({
        name: 'foo',
        updateResultKey: (resultKey) => `${resultKey}-bar`
    });
    const Child = RequestHockApplier((props) => {
        props.foo.onRequest();
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
    expect(actionCreator).toHaveBeenCalledWith(undefined, {resultKey: 'fooResultKey-bar'});
    expect(actionCreator).not.toHaveBeenCalledWith(undefined, {resultKey: 'fooResultKey'});
});

test('config.updateResultKey is called with the resultKey and props', () => {
    RequestStateSelector.mockReturnValue(EmptyState());
    const updateResultKey = jest.fn();
    const RequestHock = RequestHockFactory(jest.fn(), {...hockMeta, generateResultKey: () => 'fooResultKey'});
    const RequestHockApplier = RequestHock({
        name: 'foo',
        updateResultKey
    });
    const Child = RequestHockApplier((props) => {
        props.foo.onRequest();
        return null;
    });
    shallow(<Child store={STORE} extraProp="bar" />).dive().dive();
    expect(updateResultKey).toHaveBeenCalledWith('fooResultKey', {store: STORE, extraProp: 'bar'});
});


test('hocked component will be given and Message to props.[name]', () => {
    RequestStateSelector.mockReturnValue(EmptyState());
    const Child = RequestHockApplier((props) => {
        expect(props.foo).toBeInstanceOf(Message);
        return null;
    });

    const component = shallow(<Child store={STORE}/>).dive().dive();
});


test('Message.onRequest will dispatch an action', () => {
    RequestStateSelector.mockReturnValue(EmptyState());

    const dispatch = jest.fn();
    const store = {
        subscribe: () => {},
        getState: STORE.getState,
        dispatch
    };

    const Child = RequestHockApplier((props) => {
        props.foo.onRequest()
        return null;
    });

    const component = shallow(<Child store={store}/>).dive().dive();
    expect(dispatch).toHaveBeenCalled();
});


test('will only use a new response key once a request as returned', () => {
    const runTest = (state, key) => {
        RequestStateSelector.mockReturnValue(state);
        const responseKeyMock = jest.fn();
        const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
        const RequestHockApplier = RequestHock({name: 'foo', resultKey: 'bar'});
        const Child = RequestHockApplier((props) => {
            responseKeyMock(props.foo.resultKey);
            return null;
        });
        shallow(<Child store={STORE}/>).dive()
            .setProps({
                foo: {
                    request: jest.fn(),
                    resultKey: 'foo',
                    nextResultKey: 'bar'
                }
            })
            .dive();

        expect(responseKeyMock).toHaveBeenLastCalledWith(key);
    };

    runTest(EmptyState(), 'foo');
    runTest(FetchingState(), 'foo');
    runTest(RefetchingState(), 'foo');
    runTest(ErrorState(), 'bar');
    runTest(SuccessState(), 'bar');
});


test('will strip errors out of requestStates', () => {
    RequestStateSelector.mockReturnValue(ErrorState({message: 'error!'}));

    const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
    const RequestHockApplier = RequestHock({name: 'foo'});
    const Child = RequestHockApplier((props) => {
        props.foo.requestState.errorMap(data => {
            expect(data).toBe(null);
        });
        return null;
    });
    shallow(<Child store={STORE}/>).dive().dive();
});



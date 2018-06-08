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
    const requestHockError = t.throws(() => RequestHock({})());
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


test('will apply propChange hock if config.auto is truthy', t => {
    const PropChangeHock = stub().returns(config => config);
    const setup = (auto) => {
        const RequestHockFactory = proxyquire('../RequestHockFactory', {
                'stampy/lib/hock/PropChangeHock': PropChangeHock
            }).default;

        const RequestHock = RequestHockFactory(resolve('foo'), hockMeta);
        const RequestHockApplier = RequestHock({name: 'foo', auto});
        const Child = RequestHockApplier(() => null);
        shallow(<Child store={STORE}/>);
    }
    setup(false);
    t.is(
        PropChangeHock.callCount,
        0,
        'will not call PropChangeHock if auto is false'
    );

    setup(true);
    t.deepEqual(
        PropChangeHock.args[0][0]().paths,
        [],
        'will pass an empty array if auto is `true`'
    );

    setup(['foo', 'bar']);
    t.deepEqual(
        PropChangeHock.args[1][0]().paths,
        ['foo', 'bar'],
        'will pass auto to paths if it is not a boolean'
    );

    const onRequestSpy = spy();
    PropChangeHock.args[0][0]().onPropChange({foo: {onRequest: onRequestSpy}});
    PropChangeHock.args[1][0]().onPropChange({foo: {onRequest: onRequestSpy}});
    t.is(
        onRequestSpy.callCount,
        2,
        'will pass the the Message.onRequest callback to PropChangeHock'
    );
});


// test('RequestHockFactory will update the onMutate with new props', t => {
//     const spy1 = spy();
//     const queryCreator = ({spy}) => spy && spy();
//     const Child = (props) => {
//         return <div></div>;
//     };

//     var Component = RequestHockFactory(identity, {})(queryCreator, {})(Child);
//     var wrapper = shallow(<Component store={STORE}/>);
//     wrapper.render();
//     t.is(spy1.callCount, 0);

//     wrapper.dive().dive().prop('onMutate')({spy: spy1});
//     t.is(spy1.callCount, 1);
// });

// test('RequestHockFactory will group props if a `group` config is provided', t => {
//     const Child = (props: Object): React.Element<any> => {
//         return <div></div>;
//     };

//     var Component = RequestHockFactory(noop)(noop, {group: 'fooGroup', resultKey: 'foo'})(Child);

//     function getProp(key: string) {
//         return shallow(<Component store={STORE}/>)
//             .dive()
//             .dive()
//             .prop(key);
//     }

//     t.is(typeof getProp('fooGroup'), 'object');
//     t.is(typeof getProp('fooGroup').onMutate, 'function');
// });


// test('RequestHockFactory can be configured to update resultKey based on props', (t: Object) => {
//     const actionCreator = spy();
//     const Child = () => <div></div>;

//     var Component = RequestHockFactory(actionCreator, {})(noop, {updateResultKey: (hash, props) => props.id})(Child);
//     shallow(<Component store={STORE} id='FOO' />)
//         .dive()
//         .instance()
//         .mutation();

//     t.is(actionCreator.firstCall.args[1].resultKey, 'FOO');
// });

// test('RequestHockFactory will use the result key from `group` if provided', t => {
//     const Child = (props: Object): React.Element<any> => {
//         t.is(props.resultKey, 'bar');
//         t.is(props.fooGroup.resultKey, 'foo');
//         t.is(props.fooGroup.requestState.isFetching, true);
//         return <div></div>;
//     };

//     var Component = RequestHockFactory(identity)(identity, {group: 'fooGroup', resultKey: 'foo'})(Child);

//     const wrapper = shallow(<Component store={STORE} resultKey='bar' />)
//         .dive();

//     // invoking the mutation updates the state of the hock so that it will now pass the resultKey `foo` through to its group props
//     wrapper.instance().mutation();
//     // at this point, the hock should pass the correct request state from the store down to Child
//     wrapper.dive().render();
// });

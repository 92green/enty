// @flow
import test from 'ava';
import React from 'react';
import {Component} from 'react';
import MultiRequestHock from '../MultiRequestHock';
import {shallow} from 'enzyme';
import {fake} from 'sinon';
import {spy} from 'sinon';


import {FetchingState} from '../RequestState';
import {EmptyState} from '../RequestState';
import {RefetchingState} from '../RequestState';
import {ErrorState} from '../RequestState';
import {SuccessState} from '../RequestState';
import Message from '../data/Message';
import {RequestHockNoNameError} from '../util/Error';

const multiRequestHock = MultiRequestHock({
    name: 'foo', 
    onRequest: (props) => props.resolveFoo()
        .then(props.resolveBar)
});
const MultiComponent = multiRequestHock(() => null);

test('will create a message in props.[name]', t => {
    const hock = MultiRequestHock({
        name: 'foo', 
        onRequest: () => Promise.resolve()
    });
    const Comp = hock((props) => {
        t.true(props.foo instanceof Message);
        return null;
    });

    shallow(<Comp/>).dive();
});

test('will throw an error is config.name is not supplied', t => {
    // $FlowFixMe - deliberate misuse of types for testing
    const requestHockError = t.throws(() => MultiRequestHock({})(() => null));
    t.deepEqual(RequestHockNoNameError('MultiRequestHock'), requestHockError);
});


test('will request and response to resolved promises', t => {
    const wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.resolve('bar')}
    />);

    wrapper.dive();
    return wrapper.prop('foo')
        .onRequest()
        .then(() => {
            t.is(wrapper.prop('foo').requestState.isSuccess, true);
            t.is(wrapper.prop('foo').response, 'bar');
        })
    ;
});


test('will request and response to rejected promises', t => {
    const wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.reject('bar')}
    />);

    wrapper.dive();
    return wrapper.prop('foo')
        .onRequest()
        .then(() => {
            t.is(wrapper.prop('foo').requestState.isError, true);
            t.is(wrapper.prop('foo').requestError, 'bar');
        })
    ;
});


test.cb('will handle rerequests', t => {
    t.plan(1);
    let wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.resolve('bar')}
    />);
    wrapper.setState({fetched: true});
    wrapper.dive();

    wrapper.prop('foo')
        .onRequest()
        .then(() => {
            t.end();
        })
    ;

    t.is(wrapper.prop('foo').requestState.isRefetching, true);

});

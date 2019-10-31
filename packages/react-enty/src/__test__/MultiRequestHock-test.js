// @flow
import React from 'react';
import {Component} from 'react';
import MultiRequestHock from '../MultiRequestHock';
import {fake} from 'sinon';
import {spy} from 'sinon';

import {FetchingState} from 'enty-state/lib/data/RequestState';
import {EmptyState} from 'enty-state/lib/data/RequestState';
import {RefetchingState} from 'enty-state/lib/data/RequestState';
import {ErrorState} from 'enty-state/lib/data/RequestState';
import {SuccessState} from 'enty-state/lib/data/RequestState';
import Message from 'enty-state/lib/data/Message';
import {RequestHockNoNameError} from '../util/Error';

const multiRequestHock = MultiRequestHock({
    name: 'foo',
    onRequest: (props) => props.resolveFoo()
        .then(props.resolveBar)
});
const MultiComponent = multiRequestHock(() => null);

test('will create a message in props.[name]', () => {
    const hock = MultiRequestHock({
        name: 'foo',
        onRequest: () => Promise.resolve()
    });
    const Comp = hock((props) => {
        expect(props.foo instanceof Message).toBe(true);
        return null;
    });

    shallow(<Comp/>).dive();
});

test('will throw an error is config.name is not supplied', () => {
    // $FlowFixMe - deliberate misuse of types for testing
    const noName = () => MultiRequestHock({})(() => null);
    expect(noName).toThrow(RequestHockNoNameError('MultiRequestHock'));
});


test('will request and response to resolved promises', () => {
    const wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.resolve('bar')}
    />);

    wrapper.dive();
    return wrapper.prop('foo')
        .onRequest()
        .then(() => {
            wrapper.update();
            expect(wrapper.prop('foo').requestState.type).toBe('Success');
            expect(wrapper.prop('foo').response).toBe('bar');
        });
});


test('will request and response to rejected promises', () => {
    const wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.reject('bar')}
    />);

    wrapper.dive();
    return wrapper.prop('foo')
        .onRequest()
        .then(() => {
            wrapper.update();
            expect(wrapper.prop('foo').requestState.type).toBe('Error');
            expect(wrapper.prop('foo').requestError).toBe('bar');
        });
});


test('will handle rerequests', done => {
    expect.assertions(1);
    let wrapper = shallow(<MultiComponent
        resolveFoo={() => Promise.resolve('foo')}
        resolveBar={() => Promise.resolve('bar')}
    />);
    wrapper.setState({fetched: true});
    wrapper.dive();

    wrapper.prop('foo')
        .onRequest()
        .then(() => {
            done();
        })
    ;
    wrapper.update();


    expect(wrapper.prop('foo').requestState.type).toBe('Refetching');
});

test('will pass props to payload creator', () => {
    const onRequest = jest.fn(() => Promise.resolve());
    const hocApplier = MultiRequestHock({name: 'foo', onRequest, auto: true});
    const Component = hocApplier(() => null);

    shallow(<Component foo="bar!" />).dive();
    expect(onRequest).toHaveBeenCalledWith({foo: 'bar!'});
});
// @flow
import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema} from 'enty';
import equals from 'unmutable/equals';



//
// Test Bootstrap
//

function setupTests() {
    const {Provider, foo, fooError, bar} = EntityApi(ObjectSchema({}), {
        foo: (data = 'foo') => Promise.resolve({data}),
        fooError: () => Promise.reject('ouch!'),
        bar: (data = 'bar') => Promise.resolve({data})
    });

    function ExpectsMessage(props: Object) {
        const {onRequest} = props.message;
        const {payload} = props;
        return <button className="onRequest" onClick={() => onRequest(payload)} />;
    }

    return {
        ExpectsMessage,
        mountWithProvider: (testFn: Function, extraProps: Object = {}) => {
            const Child = testFn(ExpectsMessage);
            const SkipProvider = (props) => <Provider><Child {...props} /></Provider>;
            return mount(<SkipProvider {...extraProps} />);
        },
        foo,
        bar,
        fooError
    };
}

export const {mountWithProvider, foo, bar, fooError, ExpectsMessage} = setupTests();

export function asyncUpdate(wrapper: Object) {
    return (new Promise(resolve => setImmediate(resolve)))
        .then(() => wrapper.update());
}


//
// Custom Message Matchers


expect.extend([
    'Empty',
    'Fetching',
    'Refetching',
    'Success',
    'Error'
].reduce((rr, expectedType) => {
    let name = `toBe${expectedType}`;
    rr[name] = function(wrapper, expectedResponse) {
        let {printReceived, printExpected} = this.utils;
        let message = wrapper.find('ExpectsMessage').prop('message');
        let type = message.requestState.type;
        let response = type === ('Error') ? message.requestError : message.response;

        let passType = type === expectedType;
        let passResponse = equals(response)(expectedResponse);
        let pass = passType && passResponse;
        return pass
            ? {pass: true, message: () => `expect(wrapper).not.${name}()\n\n` +
                `Received: ${printReceived(type)}`}
            : {pass: false, message: () => `expect(wrapper).${name}()\n\n` +
                `Expected: ${printExpected(expectedType)}: ${printExpected(expectedResponse)}\n` +
                `Received: ${printReceived(type)}: ${printReceived(response)}`}
        ;
    };
    return rr;
}, {}));



//
// Test Cases
//

export async function fetchOnLoad(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
}

export async function errorOnLoad(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeError('ouch!');
}

export async function nothing(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeEmpty();
}

export async function refetch(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.onRequest').simulate('click');

    expect(wrapper).toBeEmpty();
    click();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
    click();
    expect(wrapper).toBeRefetching({data: 'foo'});
}

export async function fetchOnPropChange(testFn: Function) {
    let wrapper = mountWithProvider(testFn);

    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});

    wrapper.setProps({id: 'bar'}).update();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'bar'});
}

export async function fetchOnCallback(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.onRequest').simulate('click');

    expect(wrapper).toBeEmpty();
    click();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
}


export async function fetchSeries(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let first = () => wrapper.find('ExpectsMessage').at(0);
    let second = () => wrapper.find('ExpectsMessage').at(1);

    expect(first()).toBeFetching();
    expect(second()).toBeEmpty();
    await asyncUpdate(wrapper);
    expect(first()).toBeSuccess({data: 'first'});
    expect(second()).toBeSuccess({data: 'second'});
}

export async function fetchParallel(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let first = () => wrapper.find('ExpectsMessage').at(0);
    let second = () => wrapper.find('ExpectsMessage').at(1);

    expect(first()).toBeFetching();
    expect(second()).toBeFetching();
    await asyncUpdate(wrapper);
    expect(first()).toBeSuccess({data: 'first'});
    expect(second()).toBeSuccess({data: 'second'});
}

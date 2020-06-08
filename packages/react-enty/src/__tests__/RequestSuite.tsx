import React from 'react';
import Provider from '../Provider';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {ObjectSchema, EntitySchema} from 'enty';
import equals from 'unmutable/equals';
import {UndefinedIdError} from 'enty/lib/util/Error';
import {ReactWrapper} from 'enzyme';
import {Message, EntityStore} from 'enty-state';

//
// Test Bootstrap
//

function setupTests() {
    const fooEntity = new EntitySchema({name: 'foo'});
    const store = new EntityStore({
        api: {
            foo: (data = 'foo') => Promise.resolve({data}),
            badEntity: () => Promise.resolve({foo: {name: 'foo'}}),
            fooError: () => Promise.reject('ouch!'),
            bar: (data) => Promise.resolve({data}),
            baz: () => Promise.resolve({data: 'requested-baz'})
        },
        schema: new ObjectSchema({
            foo: fooEntity
        })
    });

    store.updateRequest('baz:initial-baz', 'success', {data: 'initial-baz'});
    store.updateRequest('foo:clash', 'success', {data: 'foo'});
    store.updateRequest('bar:clash', 'success', {data: 'bar'});

    const {foo, fooError, badEntity, bar, baz} = store.api;

    function ExpectsMessage(props: {
        payload: any;
        removeEntityPayload: [string, string];
        message: Message;
    }) {
        const {request} = props.message;
        const {payload} = props;
        return <button className="request" onClick={() => request(payload)} />;
    }

    return {
        store,
        ExpectsMessage,
        mountWithProvider: (testFn: Function, extraProps: Object = {}) => {
            const Child = testFn(ExpectsMessage);
            const SkipProvider: any = (props: any) => (
                <Provider store={store}>
                    <Child {...props} />
                </Provider>
            );
            return mount(<SkipProvider {...extraProps} />);
        },
        badEntity,
        foo,
        bar,
        baz,
        fooError
    };
}

export const {
    store,
    mountWithProvider,
    foo,
    bar,
    baz,
    badEntity,
    fooError,
    ExpectsMessage
} = setupTests();

export async function asyncUpdate<P = {}>(wrapper: ReactWrapper<P>) {
    await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        wrapper.update();
    });
}

//
// Custom Message Matchers

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeEmpty(): CustomMatcherResult;
            toBeFetching(): CustomMatcherResult;
            toBeRefetching(expected: any): CustomMatcherResult;
            toBeSuccess(expected: any): CustomMatcherResult;
            toBeError(expected: any): CustomMatcherResult;
        }
    }
}

expect.extend(
    [
        ['Empty', 'isEmpty'],
        ['Fetching', 'isFetching'],
        ['Refetching', 'isRefetching'],
        ['Success', 'isSuccess'],
        ['Error', 'isError']
    ].reduce((rr, [expectedName, expectedState], _, input) => {
        let name = `toBe${expectedName}`;
        rr[name] = function (wrapper: ReactWrapper, expectedResponse: any) {
            let {printReceived, printExpected} = this.utils;
            let message: Message = wrapper.find('ExpectsMessage').prop('message');
            let {isError} = message;
            let response = isError ? message.requestError : message.response;

            let passType = message[expectedState];
            let passResponse = equals(response)(expectedResponse);
            let pass = passType && passResponse;

            let type = input.find(([, state]) => message[state]);

            /* istanbul ignore next */
            const passMessage = () =>
                `expect(wrapper).not.${name}()\n\n` + `Received: ${printReceived(expectedName)}`;

            /* istanbul ignore next */
            const failMessage = () =>
                `expect(wrapper).${name}()\n\n` +
                `Expected: ${printExpected(expectedName)}: ${printExpected(expectedResponse)}\n` +
                `Received: ${printReceived(type[0])}: ${printReceived(response)}`;

            return pass ? {pass: true, message: passMessage} : {pass: false, message: failMessage};
        };
        return rr;
    }, {})
);

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

export async function fetchBadEntity(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeError(UndefinedIdError('foo'));
}

export async function exisitingKey(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.request').simulate('click');
    expect(wrapper).toBeSuccess({data: 'initial-baz'});
    click();
    expect(wrapper).toBeRefetching({data: 'initial-baz'});
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'requested-baz'});
}

export async function keyClash(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let first: Message = wrapper.find('ExpectsMessage').at(0).prop('message');
    let second: Message = wrapper.find('ExpectsMessage').at(1).prop('message');
    expect(first.response).not.toEqual(second.response);
}

export async function nothing(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeEmpty();
}

export async function refetch(testFn: Function) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.request').simulate('click');

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
    wrapper.setProps({id: 'foo'}).update();

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
    let click = () => wrapper.find('.request').simulate('click');

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

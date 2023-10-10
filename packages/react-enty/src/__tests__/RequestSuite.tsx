import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema, EntitySchema} from 'enty';
import {UndefinedIdError} from 'enty';
import RequestState from '../data/RequestState';
import Message from '../data/Message';
import {mount} from 'enzyme';

//
// Test Bootstrap
//

function setupTests() {
    const fooEntity = new EntitySchema('foo');
    const api = EntityApi(
        {
            foo: async (data: string = 'foo') => ({data}),
            entity: async (foo: {id: string; name: string} = {id: '123', name: 'foo'}) => ({foo}),
            badEntity: async (foo: {name: string} = {name: 'foo'}) => ({foo}),
            fooError: async () => {
                throw new Error('ouch!');
            },
            bar: async (data: string = 'bar') => ({data}),
            baz: async (data: string = 'requested-baz') => ({data})
        },
        new ObjectSchema({
            foo: fooEntity
        })
    );
    const {Provider, foo, fooError, badEntity, bar, baz, entity} = api;

    function ExpectsMessage(props: {
        message: Message<any, any>;
        payload?: any;
        removeEntityPayload?: [string, string];
    }) {
        const {request, reset, removeEntity} = props.message;
        const {payload} = props;
        const {removeEntityPayload} = props;
        return (
            <>
                <button className="request" onClick={() => request(payload)} />
                <button className="reset" onClick={() => reset()} />
                <button
                    className="removeEntity"
                    onClick={() => removeEntityPayload && removeEntity(...removeEntityPayload)}
                />
            </>
        );
    }

    return {
        ExpectsMessage,
        mountWithProvider: (testFn: Function, extraProps: Object = {}) => {
            const Child = testFn(ExpectsMessage);
            const SkipProvider = (props: any) => (
                <Provider
                    initialState={{
                        entities: {},

                        // Hashed key of 'baz'
                        response: {baz: {data: 'initial-baz'}},
                        requestState: {baz: RequestState.success()}
                    }}
                    children={<Child {...props} />}
                />
            );
            return mount(<SkipProvider {...extraProps} />);
        },
        badEntity,
        entity,
        foo,
        bar,
        baz,
        fooError
    };
}

export const {mountWithProvider, foo, bar, baz, badEntity, entity, fooError, ExpectsMessage} =
    setupTests();

export async function asyncUpdate(wrapper: any) {
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => wrapper.update());
}

//
// Custom Message Matchers

expect.extend(
    [
        ['Empty', 'isEmpty'],
        ['Fetching', 'isFetching'],
        ['Refetching', 'isRefetching'],
        ['Success', 'isSuccess'],
        ['Error', 'isError']
    ].reduce((rr, [expectedName, expectedState], _, input) => {
        let name = `toBe${expectedName}`;
        rr[name] = function (wrapper: any, expectedResponse: any) {
            let {printReceived, printExpected} = this.utils;
            let message = wrapper.find('ExpectsMessage').prop('message');
            let {requestState} = message;
            let response = requestState.isError ? message.requestError : message.response;

            let passType = requestState[expectedState];
            let passResponse = JSON.stringify(response) === JSON.stringify(expectedResponse);
            let pass = passType && passResponse;
            let type = input.find(([, state]) => requestState[state]) || [];
            return pass
                ? {
                      pass: true,
                      message: () =>
                          `expect(wrapper).not.${name}()\n\n` +
                          `Received: ${printReceived(expectedName)}`
                  }
                : {
                      pass: false,
                      message: () =>
                          `expect(wrapper).${name}()\n\n` +
                          `Expected: ${printExpected(expectedName)}: ${printExpected(
                              expectedResponse
                          )}\n` +
                          `Received: ${printReceived(type[0])}: ${printReceived(response)}`
                  };
        };
        return rr;
    }, {} as any)
);

//
// Test Cases
//

type TestFn = (expectsMessage: typeof ExpectsMessage) => any;

export async function fetchOnLoad(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
}

export async function errorOnLoad(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeError(new Error('ouch!'));
}

export async function fetchBadEntity(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeError(UndefinedIdError('foo'));
}

export async function exisitingKey(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.request').simulate('click');
    expect(wrapper).toBeSuccess({data: 'initial-baz'});
    click();
    expect(wrapper).toBeRefetching({data: 'initial-baz'});
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'requested-baz'});
}

export async function keyClash(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let first: Message<any, any> = wrapper.find('ExpectsMessage').at(0).prop('message');
    let second: Message<any, any> = wrapper.find('ExpectsMessage').at(1).prop('message');
    expect(first.responseKey).not.toBe(second.responseKey);
}

export async function nothing(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    expect(wrapper).toBeEmpty();
}

export async function refetch(testFn: TestFn) {
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

export async function reset(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let clickRequest = () => wrapper.find('.request').simulate('click');
    let clickReset = () => wrapper.find('.reset').simulate('click');

    expect(wrapper).toBeEmpty();
    clickRequest();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
    clickReset();
    expect(wrapper).toBeEmpty();
}

export async function removeEntity(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let clickRequest = () => wrapper.find('.request').simulate('click');
    let clickRemove = () => wrapper.find('.removeEntity').simulate('click');

    expect(wrapper).toBeEmpty();
    clickRequest();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({foo: {id: '123', name: 'foo'}});
    clickRemove();
    expect(wrapper).toBeSuccess({});
}

export async function fetchOnPropChange(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);

    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});

    wrapper.setProps({id: 'bar'}).update();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'bar'});
}

export async function fetchOnCallback(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let click = () => wrapper.find('.request').simulate('click');

    expect(wrapper).toBeEmpty();
    click();
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess({data: 'foo'});
}

export async function fetchSeries(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let first = () => wrapper.find('ExpectsMessage').at(0);
    let second = () => wrapper.find('ExpectsMessage').at(1);

    expect(first()).toBeFetching();
    expect(second()).toBeEmpty();
    await asyncUpdate(wrapper);
    expect(first()).toBeSuccess({data: 'first'});
    expect(second()).toBeSuccess({data: 'second'});
}

export async function fetchParallel(testFn: TestFn) {
    let wrapper = mountWithProvider(testFn);
    let first = () => wrapper.find('ExpectsMessage').at(0);
    let second = () => wrapper.find('ExpectsMessage').at(1);

    expect(first()).toBeFetching();
    expect(second()).toBeFetching();
    await asyncUpdate(wrapper);
    expect(first()).toBeSuccess({data: 'first'});
    expect(second()).toBeSuccess({data: 'second'});
}

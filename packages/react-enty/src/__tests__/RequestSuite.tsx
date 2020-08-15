import {mount} from 'enzyme';
import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema, EntitySchema} from 'enty';
import equals from 'unmutable/equals';
import {UndefinedIdError} from 'enty/lib/util/Error';
import RequestState from 'enty-state/lib/data/RequestState';
import {ReactWrapper} from 'enzyme';
import Message from 'enty-state/lib/data/Message';
import {act} from 'react-dom/test-utils';

//
// Test Bootstrap
//

function setupTests() {
    const fooEntity = new EntitySchema('foo');
    const {Provider, foo, fooError, badEntity, bar, baz, obs, entity} = EntityApi(
        {
            foo: (data = 'foo') => Promise.resolve({data}),
            entity: (foo = {id: '123', name: 'foo'}) => Promise.resolve({foo}),
            badEntity: (foo = {name: 'foo'}) => Promise.resolve({foo}),
            fooError: () => Promise.reject('ouch!'),
            bar: (data = 'bar') => Promise.resolve({data}),
            baz: (data = 'requested-baz') => Promise.resolve({data}),
            obs: () => ({subscribe: () => {}})
        },
        new ObjectSchema({
            foo: fooEntity
        })
    );

    function ExpectsMessage(props: {
        payload?: any;
        removeEntityPayload?: [string, string];
        message: Message<any>;
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
        mountWithProvider: (testFn: Function, extraProps: Object = {}): ReactWrapper => {
            const Child = testFn(ExpectsMessage);
            const SkipProvider: any = (props: any) => (
                <Provider
                    initialState={{
                        entities: {},

                        // Hashed key of 'baz'
                        response: {'1379365508': {data: 'initial-baz'}},
                        requestState: {'1379365508': RequestState.success()}
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
        obs,
        fooError
    };
}

export const {
    mountWithProvider,
    foo,
    bar,
    baz,
    obs,
    badEntity,
    entity,
    fooError,
    ExpectsMessage
} = setupTests();

export async function asyncUpdate<P = {}>(wrapper: ReactWrapper<P>): Promise<any> {
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => wrapper.update());
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
            type JestUtilFn = {utils: {printReceived: Function; printExpected: Function}};
            let {printReceived, printExpected} = (this as JestUtilFn).utils;
            let message: Message<any> = wrapper.find('ExpectsMessage').prop('message');
            let {requestState} = message;
            let response = requestState.isError ? message.requestError : message.response;
            let passType = requestState[expectedState];
            let passResponse = equals(response)(expectedResponse);
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
    expect(wrapper).toBeError(UndefinedIdError('foo', null));
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
    let first: Message<any> = wrapper.find('ExpectsMessage').at(0).prop('message');
    let second: Message<any> = wrapper.find('ExpectsMessage').at(1).prop('message');
    expect(first.responseKey).not.toBe(second.responseKey);
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

export async function reset(testFn: Function) {
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

export async function removeEntity(testFn: Function) {
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
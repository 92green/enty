import React from 'react';
import {MessageFactory} from '../data/Message';
import LoadingBoundary from '../LoadingBoundary';
import {shallow, mount} from 'enzyme';

const TestEmpty = () => null;
const TestError = () => null;
const TestFallback = () => null;

const request: any = async () => 'FOO';
const messageInput = {
    response: 'RESPONSE',
    responseKey: 'FOO',
    reset: () => {},
    removeEntity: () => {},
    request,
    requestError: new Error('OUCH!')
};

describe('Empty', () => {
    it('will render empty', () => {
        const Component = shallow(
            <LoadingBoundary
                message={MessageFactory.empty(messageInput)}
                empty={TestEmpty}
                children={() => null}
            />
        );
        expect(Component.find('TestEmpty').length).toBeGreaterThan(0);
    });
});

describe('Fetching', () => {
    it('will render fallback', () => {
        const wrapper = shallow(
            <LoadingBoundary
                message={MessageFactory.fetching(messageInput)}
                fallback={TestFallback}
                children={() => null}
            />
        );
        expect(wrapper.find('TestFallback').length).toBeGreaterThan(0);
    });
});

describe('Refetching', () => {
    it('will render children with response and extra boolean', () => {
        shallow(
            <LoadingBoundary
                message={MessageFactory.refetching(messageInput)}
                children={(response, {refetching}) => {
                    expect(response).toBe('RESPONSE');
                    expect(refetching).toBe(true);
                    return null;
                }}
            />
        );
    });

    it('will render fallback on if fallbackOnRefetch is true', () => {
        const wrapper = shallow(
            <LoadingBoundary
                message={MessageFactory.refetching(messageInput)}
                fallback={TestFallback}
                fallbackOnRefetch={true}
                children={() => null}
            />
        );
        expect(wrapper.find('TestFallback')).toHaveLength(1);
    });
});

describe('Success', () => {
    it('will render children with response', () => {
        shallow(
            <LoadingBoundary
                message={MessageFactory.success(messageInput)}
                children={(response, {refetching}) => {
                    expect(response).toBe('RESPONSE');
                    expect(refetching).toBe(false);
                    return null;
                }}
            />
        );
    });
});

describe('Error', () => {
    it('will render error with requestError in props.error', () => {
        const wrapper = shallow(
            <LoadingBoundary
                message={MessageFactory.error(messageInput)}
                error={TestError}
                children={() => null}
            />
        );
        expect(wrapper.find('TestError')).toHaveLength(1);
        // @ts-ignore
        expect(wrapper.find('TestError').props().error).toBe('Error: OUCH!');
    });
});

describe('SafeRendering', () => {
    it('will not render anything if not provided', () => {
        const empty = mount(
            <LoadingBoundary children={() => null} message={MessageFactory.empty(messageInput)} />
        );
        const fetching = mount(
            <LoadingBoundary
                children={() => null}
                message={MessageFactory.fetching(messageInput)}
            />
        );
        const error = mount(
            <LoadingBoundary children={() => null} message={MessageFactory.error(messageInput)} />
        );
        expect(empty.find('NullRender')).toHaveLength(1);
        expect(fetching.find('NullRender')).toHaveLength(1);
        expect(error.find('NullRender')).toHaveLength(1);
    });
});

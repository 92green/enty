import 'jest-enzyme';
import {shallow, mount} from 'enzyme';
import React from 'react';
import Message from 'enty/lib/state/Message';
import LoadingBoundary from '../LoadingBoundary';

const TestEmpty = () => null;
const TestError = () => null;
const TestFallback = () => null;

const messageInput = {
    response: 'RESPONSE',
    responseKey: 'FOO',
    reset: () => {},
    removeEntity: () => {},
    request: async () => 'FOO',
    requestError: new Error('OUCH!')
};

const emptyMessageInput = {...messageInput, response: undefined};

describe('Empty', () => {
    it('will render empty', () => {
        const Component = shallow(
            <LoadingBoundary
                message={Message.empty(emptyMessageInput)}
                empty={TestEmpty}
                children={() => null}
            />
        );
        expect(Component).toContainMatchingElement('TestEmpty');
    });
});

describe('Fetching', () => {
    it('will render fallback', () => {
        const wrapper = shallow(
            <LoadingBoundary
                message={Message.fetching(emptyMessageInput)}
                fallback={TestFallback}
                children={() => null}
            />
        );
        expect(wrapper).toContainMatchingElement('TestFallback');
    });
});

describe('Refetching', () => {
    it('will render children with response and extra boolean', () => {
        shallow(
            <LoadingBoundary
                message={Message.refetching(messageInput)}
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
                message={Message.refetching(messageInput)}
                fallback={TestFallback}
                fallbackOnRefetch={true}
                children={() => null}
            />
        );
        expect(wrapper).toContainMatchingElement('TestFallback');
    });
});

describe('Success', () => {
    it('will render children with response', () => {
        shallow(
            <LoadingBoundary
                message={Message.success(messageInput)}
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
                message={Message.error(messageInput)}
                error={TestError}
                children={() => null}
            />
        );
        expect(wrapper).toContainMatchingElement('TestError');
        expect(wrapper.find('TestError')).toHaveProp('error', new Error('OUCH!'));
    });
});

describe('SafeRendering', () => {
    it('will not render anything if not provided', () => {
        const empty = mount(
            <LoadingBoundary children={() => null} message={Message.empty(emptyMessageInput)} />
        );
        const fetching = mount(
            <LoadingBoundary children={() => null} message={Message.fetching(emptyMessageInput)} />
        );
        const error = mount(
            <LoadingBoundary children={() => null} message={Message.error(messageInput)} />
        );
        expect(empty).toContainMatchingElement('NullRender');
        expect(fetching).toContainMatchingElement('NullRender');
        expect(error).toContainMatchingElement('NullRender');
    });
});

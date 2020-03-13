// @flow
import React from 'react';
import Message from 'enty-state/lib/data/Message';
import LoadingBoundaryHoc from '../LoadingBoundaryHoc';

const TestEmpty = () => null;
const TestError = () => null;
const TestFallback = () => null;
const NullRender = () => null;

const messageInput = {
    response: 'RESPONSE',
    responseKey: 'FOO',
    reset: () => {},
    request: async () => 'FOO',
    requestError: 'OUCH!'
};

describe('Empty', () => {

    it('will render empty', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo',
            empty: TestEmpty
        })(NullRender);
        const wrapper = mount(<Hoc foo={Message.empty(messageInput)} />);
        expect(wrapper).toContainMatchingElement('TestEmpty');
    });

});

describe('Fetching', () => {

    it('will render fallback', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo',
            fallback: TestFallback
        })(NullRender);
        const wrapper = mount(<Hoc foo={Message.fetching(messageInput)} />);
        expect(wrapper).toContainMatchingElement('TestFallback');
    });

});

describe('Refetching', () => {

    it('will render fallback on if fallbackOnRefetch is true', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo',
            fallback: TestFallback,
            fallbackOnRefetch: true
        })(NullRender);
        const wrapper = mount(<Hoc foo={Message.refetching(messageInput)} />);
        expect(wrapper).toContainMatchingElement('TestFallback');
    });

});

describe('Success', () => {

    it('will render children with message at config.name', () => {
        const message = Message.success(messageInput);
        const Hoc = LoadingBoundaryHoc({
            name: 'foo'
        })(NullRender);
        const wrapper = mount(<Hoc foo={message} />);
        expect(wrapper.find('NullRender')).toHaveProp('foo', message);
    });

    it('will allow response to be mapped to props', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo',
            mapResponseToProps: (response) => ({baz: response})
        })(NullRender);
        const wrapper = mount(<Hoc foo={Message.success(messageInput)} />);
        expect(wrapper.find('NullRender')).toHaveProp('baz', 'RESPONSE');
    });
});

describe('Error', () => {

    it('will render error with requestError in props.error', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo',
            error: TestError
        })(NullRender);
        const wrapper = mount(<Hoc foo={Message.error(messageInput)} />);
        expect(wrapper).toContainMatchingElement('TestError');
        expect(wrapper.find('TestError')).toHaveProp('error', 'OUCH!');
    });

});

describe('SafeRendering', () => {

    it('will not render anything if not provided', () => {
        const Hoc = LoadingBoundaryHoc({
            name: 'foo'
        })(NullRender);
        const empty = mount(<Hoc foo={Message.empty(messageInput)} />);
        const fetching = mount(<Hoc foo={Message.fetching(messageInput)} />);
        const error = mount(<Hoc foo={Message.error(messageInput)} />);
        expect(empty).toContainMatchingElement('NullRender');
        expect(fetching).toContainMatchingElement('NullRender');
        expect(error).toContainMatchingElement('NullRender');
    });

});

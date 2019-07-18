// @flow
import React from 'react';
import {EmptyMessage} from 'enty-state/lib/data/Message';
import {FetchingMessage} from 'enty-state/lib/data/Message';
import {RefetchingMessage} from 'enty-state/lib/data/Message';
import {SuccessMessage} from 'enty-state/lib/data/Message';
import {ErrorMessage} from 'enty-state/lib/data/Message';
import LoadingBoundary from '../LoadingBoundary';

const TestEmpty = () => null;
const TestError = () => null;
const TestFallback = () => null;

describe('Empty', () => {

    it('will render empty', () => {
        const Component = shallow(<LoadingBoundary
            message={EmptyMessage()}
            empty={TestEmpty}
            children={() => null}
        />);
        expect(Component).toContainMatchingElement('TestEmpty');
    });

});

describe('Fetching', () => {

    it('will render fallback', () => {
        const wrapper = shallow(<LoadingBoundary
            message={FetchingMessage()}
            fallback={TestFallback}
            children={() => null}
        />);
        expect(wrapper).toContainMatchingElement('TestFallback');
    });

});

describe('Refetching', () => {

    it('will render children with response and extra boolean', () => {
        shallow(<LoadingBoundary
            message={RefetchingMessage('RESPONSE')}
            children={(response, {refetching}) => {
                expect(response).toBe('RESPONSE');
                expect(refetching).toBe(true);
                return null;
            }}
        />);
    });

    it('will render fallback on if fallbackOnRefetch is true', () => {
        const wrapper = shallow(<LoadingBoundary
            message={RefetchingMessage()}
            fallback={TestFallback}
            fallbackOnRefetch={true}
            children={() => null}
        />);
        expect(wrapper).toContainMatchingElement('TestFallback');
    });

});

describe('Success', () => {

    it('will render children with response', () => {
        shallow(<LoadingBoundary
            message={SuccessMessage('RESPONSE')}
            children={(response, {refetching}) => {
                expect(response).toBe('RESPONSE');
                expect(refetching).toBe(false);
                return null;
            }}
        />);
    });

});

describe('Error', () => {

    it('will render error with requestError in props.error', () => {
        const wrapper = shallow(<LoadingBoundary
            message={ErrorMessage('OUCH!')}
            error={TestError}
            children={() => null}
        />);
        expect(wrapper).toContainMatchingElement('TestError');
        expect(wrapper.find('TestError')).toHaveProp('error', 'OUCH!');
    });

});

describe('SafeRendering', () => {

    it('will not render anything if not provided', () => {
        const empty = mount(<LoadingBoundary children={() => null} message={EmptyMessage()} />);
        const fetching = mount(<LoadingBoundary children={() => null} message={FetchingMessage()} />);
        const error = mount(<LoadingBoundary children={() => null} message={ErrorMessage()} />);
        expect(empty).toContainMatchingElement('NullRender');
        expect(fetching).toContainMatchingElement('NullRender');
        expect(error).toContainMatchingElement('NullRender');
    });

});

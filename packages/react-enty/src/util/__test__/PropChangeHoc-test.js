// @flow
import React from 'react';
import PropChangeHoc from '../PropChangeHoc';
import composeWith from 'unmutable/lib/util/composeWith';

const nullComponent = () => null;

test('PropChangeHock passes props straight through to children', () => {
    const Wrapped = PropChangeHoc({
        auto: ['aa'],
        onPropChange: () => {}
    })(nullComponent);

    expect(shallow(<Wrapped myProp="foo" />)).toHaveProp('myProp', 'foo');
});

test('PropChangeHock calls onPropChange function on componentDidMount', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            auto: ['aa'],
            onPropChange
        }),
        nullComponent
    );

    shallow(<Wrapped foo="bar" />);
    expect(onPropChange).toHaveBeenCalledWith({foo: 'bar'});
});

it('doesnt call onPropChange on componentWillReceiveProps if no paths have changed', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            auto: ['bats'],
            onPropChange
        }),
        nullComponent
    );
    shallow(<Wrapped foo="bar" />).setProps({foo: '!!!'});
    expect(onPropChange).toHaveBeenCalledTimes(1);
});

it('calls onPropChange on componentWillReceiveProps when a path has changed', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            auto: ['bats'],
            onPropChange
        }),
        nullComponent
    );
    shallow(<Wrapped foo="bar" />).setProps({bats: '!!!'});
    expect(onPropChange).toHaveBeenCalledTimes(2);
});

it('doesnt call onPropChange on componentWillReceiveProps when no paths with dots have changed', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            auto: ['bats.wings'],
            onPropChange
        }),
        nullComponent
    );
    shallow(<Wrapped bats={{wings: null}} />).setProps({bats: {wings: null, other: '!!!'}});
    expect(onPropChange).toHaveBeenCalledTimes(1);
});

it('calls onPropChange on componentWillReceiveProps when a path with dots has changed', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            auto: ['bats.wings'],
            onPropChange
        }),
        nullComponent
    );
    shallow(<Wrapped bats={{wings: null}} />).setProps({bats: {wings: '!!!'}});
    expect(onPropChange).toHaveBeenCalledTimes(2);
});

describe('config.shouldComponentAutoRequest', () => {

    it('will fire onPropChange if shouldComponentAutoRequest returns true', () => {
        const onPropChange = jest.fn();
        const Wrapped = composeWith(
            PropChangeHoc({
                auto: true,
                onPropChange,
                shouldComponentAutoRequest: () => true
            }),
            nullComponent
        );
        shallow(<Wrapped />);
        expect(onPropChange).toHaveBeenCalledTimes(1);
    });

    it('will not fire onPropChange if shouldComponentAutoRequest returns true', () => {
        const onPropChange = jest.fn();
        const Wrapped = composeWith(
            PropChangeHoc({
                auto: true,
                onPropChange,
                shouldComponentAutoRequest: () => false
            }),
            nullComponent
        );
        shallow(<Wrapped />);
        expect(onPropChange).toHaveBeenCalledTimes(0);
    });

    it('will default to fire onPropChange if shouldComponentAutoRequest is not defined', () => {
        const onPropChange = jest.fn();
        const Wrapped = composeWith(
            PropChangeHoc({
                auto: true,
                onPropChange
            }),
            nullComponent
        );
        shallow(<Wrapped />);
        expect(onPropChange).toHaveBeenCalledTimes(1);
    });
});

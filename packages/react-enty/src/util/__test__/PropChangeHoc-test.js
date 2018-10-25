// @flow
import React from 'react';
import PropChangeHoc from '../PropChangeHoc';
import composeWith from 'unmutable/lib/util/composeWith';

const nullComponent = () => null;

test('PropChangeHock passes props straight through to children', () => {
    const Wrapped= PropChangeHoc({
        paths: ['aa'],
        onPropChange: () => {}
    })(nullComponent);

    expect(shallow(<Wrapped myProp="foo" />)).toHaveProp('myProp', 'foo');
});

test('PropChangeHock calls onPropChange function on componentDidMount', () => {
    const onPropChange = jest.fn();
    const Wrapped = composeWith(
        PropChangeHoc({
            paths: ['aa'],
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
            paths: ['bats'],
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
            paths: ['bats'],
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
            paths: ['bats.wings'],
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
            paths: ['bats.wings'],
            onPropChange
        }),
        nullComponent
    );
    shallow(<Wrapped bats={{wings: null}} />).setProps({bats: {wings: '!!!'}});
    expect(onPropChange).toHaveBeenCalledTimes(2);
});

//test('PropChangeHock: onPropChange will noop when not provided.', tt => {
    //const WrappedComponent = PropChangeHock(() => ({paths: []}))(() => <div/>);
    //tt.notThrows(() => shallow(<WrappedComponent bats={{wings: null}} />).instance().componentDidMount());
//});

//test('PropChangeHock: will pass onPropChange to child if config.passOnPropChange is true', tt => {
    //const onPropChange = () => {};
    //const WrappedComponent = PropChangeHock(() => ({onPropChange, passOnPropChange: true}))(() => <div/>);
    //tt.is(shallow(<WrappedComponent />).prop('onPropChange'), onPropChange);
//});

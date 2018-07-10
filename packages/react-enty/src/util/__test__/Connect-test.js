import React from 'react';
import Connect from '../Connect';

import {configure} from 'enzyme';
import {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});


var OLD = {a: 1};
var NEW = {a: 1};
var STATE = {entity: OLD};

export const shallowWithState = (Component) => {
    const context = {
        store: {
            getState: () => STATE,
            subscribe: () => ({}),
            dispatch: () => ({})
        }
    };
    return shallow(Component, {context});
};

const Compy = Connect(state => state)(() => {
    return null;
});

test('Connect will check strict equality on state.[stateKey] before updating', () => {
    const wrapper = shallowWithState(<Compy/>);
    wrapper.setProps({a:1});
    wrapper.setProps({a:2});
    expect(OLD).toBe(wrapper.prop('entity'));
});

test('Connect will check strict equality on state.[stateKey] before updating', () => {
    const wrapper = shallowWithState(<Compy/>);
    wrapper.setProps({a:1});
    STATE = {entity: NEW};
    wrapper.setProps({a:2});
    expect(OLD).not.toBe(wrapper.prop('entity'));
});


test('Connect will check other state keys', () => {
    var OLD = {a: 1};
    var NEW = {a: 1};
    STATE = {other: OLD};

    const Compy = Connect(state => state, {stateKey: 'other'})(() => {
        return null;
    });

    const wrapper = shallowWithState(<Compy/>);
    wrapper.setProps({a:1});
    STATE = {other: NEW};
    wrapper.setProps({a:2});
    expect(OLD).not.toBe(wrapper.prop('other'));
});

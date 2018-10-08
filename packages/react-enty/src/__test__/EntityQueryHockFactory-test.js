//@flow
import React from 'react';
import type {Element} from 'react';
import {fromJS} from 'immutable';
import EntityQueryHockFactory from '../EntityQueryHockFactory';
import {FetchingState} from '../RequestState';


var NOOP = () => {};
var STORE = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({
        entity: fromJS({
            _requestState: {
                foo: FetchingState()
            }
        })
    })
};

global.console = {warn: jest.fn()}

var QUERY_CREATOR = () => `query`;
var entityQuery = EntityQueryHockFactory(NOOP);
var hockedComponent = entityQuery(QUERY_CREATOR, ['keys']);


test('EntityQueryHockFactory should return a function', () => {
    expect(typeof entityQuery).toBe('function');
});

test('EntityQueryHockFactorys hockedComponent should be a function', () => {
    expect(typeof hockedComponent).toBe('function');
});

test('EntityQueryHockFactorys hockedComponent should be an auto request', () => {
    const NOOP_COMPONENT = () => <div/>;
    var RunTheHock = hockedComponent(NOOP_COMPONENT);
    expect(RunTheHock.displayName).toBe('Connect(PropChangeHock)');
});


test('resultKey is derived either from the metaOverride or a hash of the queryCreator', () => {
    const NOOP_COMPONENT = () => <div/>;
    const sideEffectA = (aa: any, bb: any) => {
        expect(bb.resultKey).toBe('foo');
    };

    const sideEffectB = (aa: any, bb: any) => {
        expect(bb.resultKey).toBe('3938');
    };


    var ComponentA = EntityQueryHockFactory(sideEffectA)(NOOP, {resultKey: 'foo'})(NOOP_COMPONENT);
    var ComponentB = EntityQueryHockFactory(sideEffectB)(NOOP)(NOOP_COMPONENT);

    shallow(<ComponentA store={STORE}/>)
        .dive()
        .instance()
        .componentDidMount()
    ;

    shallow(<ComponentB store={STORE}/>)
        .dive()
        .instance()
        .componentDidMount()
    ;
});


test('requestState will return an empty RequestState for unknown resultKey', () => {
    const Child = (props: Object): Element<any> => {
        expect(props.requestState instanceof FetchingState().constructor).toBeTruthy();
        expect(props.requestState.value('foo')).toBe('foo');
        return <div></div>;
    };

    var Component = EntityQueryHockFactory(NOOP)(NOOP, {resultKey: 'blah'})(Child);

    shallow(<Component store={STORE}/>)
        .dive()
        .dive();
});

test('EntityQueryHockFactory will group props if a `group` config is provided', () => {
    const Child = (props: Object): Element<any> => {
        expect(props.fooGroup.requestState instanceof FetchingState().constructor).toBe(true);
        expect(props.fooGroup.requestState.value('foo')).toBe('foo');
        return <div></div>;
    };

    var Component = EntityQueryHockFactory(NOOP)(NOOP, {group: 'fooGroup'})(Child);

    shallow(<Component store={STORE}/>)
        .dive()
        .dive();
});


test('EntityQueryHockFactory can be configured to update resultKey based on props', () => {
    var actionCreator = jest.fn();
    var dispatch = jest.fn();

    var store = {
        subscribe: STORE.subscribe,
        dispatch,
        getState: STORE.getState
    };

    const NOOP_COMPONENT = () => <div/>;
    const mount = (comp) => shallow(comp)
        .dive()
        .instance()
        .componentDidMount();


    var Component = EntityQueryHockFactory(actionCreator)(NOOP, {updateResultKey: (hash, props) => props.id})(NOOP_COMPONENT);

    mount(<Component store={store} id="1" />);
    mount(<Component store={store} id="2" />);
    mount(<Component store={store} id="3" />);

    const calls = actionCreator.mock.calls;

    expect(calls[0][1].resultKey).toBe('1');
    expect(calls[2][1].resultKey).toBe('2');
    expect(calls[4][1].resultKey).toBe('3');
});


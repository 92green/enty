import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
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

var QUERY_CREATOR = () => `query`;
var entityQuery = EntityQueryHockFactory(NOOP);
var hockedComponent = entityQuery(QUERY_CREATOR, ['keys']);

test('EntityQueryHockFactory should return a function', tt => {
    tt.is(typeof entityQuery, 'function');
});

test('EntityQueryHockFactorys hockedComponent should be a function', tt => {
    tt.is(typeof hockedComponent, 'function');
});

test('EntityQueryHockFactorys hockedComponent should be an auto request', tt => {
    var RunTheHock = hockedComponent();
    tt.is(RunTheHock.displayName, 'Connect(PropChangeHock)');
});


test('resultKey is derived either from the metaOverride or a hash of the queryCreator', tt => {
    const sideEffectA = (aa,bb) => {
        tt.is(bb.resultKey, 'foo');
    };

    const sideEffectB = (aa,bb) => {
        tt.is(bb.resultKey, 469309513);
    };

    var ComponentA = EntityQueryHockFactory(sideEffectA)(NOOP, ['keys'], {resultKey: 'foo'})(NOOP);
    var ComponentB = EntityQueryHockFactory(sideEffectB)(NOOP, ['keys'])(NOOP);

    shallow(<ComponentA store={STORE}/>).dive();
    shallow(<ComponentB store={STORE}/>).dive();
});


test('requestState will return an empty RequestState for unknown resultKey', tt => {
    const Child = (props) => {
        tt.truthy(props.queryRequestState instanceof FetchingState().constructor);
        tt.is(props.queryRequestState.value('foo'), 'foo');
        return <div></div>;
    };

    var Component = EntityQueryHockFactory(NOOP)(NOOP, [], {resultKey: 'blah'})(Child);

    shallow(<Component store={STORE}/>).dive().dive();
});

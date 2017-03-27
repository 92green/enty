import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {fromJS} from 'immutable';
import CreateEntityQuery from '../CreateEntityQuery';
import RequestState, {RequestFetching} from 'request-state-monad';

var NOOP = () => {};
var STORE = {
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({
        entity: fromJS({
            _requestState: {
                foo: RequestFetching()
            }
        })
    })
};

var QUERY_CREATOR = () => `query`;
var entityQuery = CreateEntityQuery(NOOP);
var hockedComponent = entityQuery(QUERY_CREATOR, ['keys']);

test('CreateEntityQuery should return a function', tt => {
    tt.is(typeof entityQuery, 'function');
});

test('CreateEntityQuerys hockedComponent should be a function', tt => {
    tt.is(typeof hockedComponent, 'function');
});

test('CreateEntityQuerys hockedComponent should be an auto request', tt => {
    var RunTheHock = hockedComponent();
    tt.is(RunTheHock.displayName, 'Connect(AutoRequest)');
});


test('resultKey is derived either from the metaOverride or a hash of the queryCreator', tt => {
    const sideEffectA = (aa,bb) => {
        tt.is(bb.resultKey, 'foo');
    };

    const sideEffectB = (aa,bb) => {
        tt.is(bb.resultKey, 469309513);
    };

    var ComponentA = CreateEntityQuery(sideEffectA)(NOOP, ['keys'], {resultKey: 'foo'})(NOOP);
    var ComponentB = CreateEntityQuery(sideEffectB)(NOOP, ['keys'])(NOOP);

    shallow(<ComponentA store={STORE}/>).dive();
    shallow(<ComponentB store={STORE}/>).dive();
});


test('requestState will return an empty RequestState for unknown resultKey', tt => {
    const Child = (props) => {
        tt.truthy(props.requestState instanceof RequestState);
        tt.is(props.requestState.orValue('foo'), 'foo');
        return <div></div>;
    };

    var Component = CreateEntityQuery(NOOP)(NOOP, [], {resultKey: 'blah'})(Child);

    shallow(<Component store={STORE}/>).dive().dive();
});

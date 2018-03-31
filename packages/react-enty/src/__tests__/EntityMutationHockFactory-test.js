import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {fromJS} from 'immutable';
import EntityMutationHockFactory from '../EntityMutationHockFactory';
import {FetchingState} from '../RequestState';

var NOOP = () => {};
var PASS = (aa) => aa;
var STORE = {
    subscribe: () => {},
    dispatch: (aa) => aa,
    getState: () => ({
        entity: fromJS({
            _requestState: {
                foo: FetchingState()
            }
        })
    })
};

var QUERY_CREATOR = () => `query`;
var entityMutation = EntityMutationHockFactory(PASS);
var hockedComponent = entityMutation(QUERY_CREATOR, ['keys']);

test("EntityMutationHockFactory should return a function", tt => {
    tt.is(typeof entityMutation, "function");
});

test("EntityMutationHockFactory's hockedComponent should be a function", tt => {
    tt.is(typeof hockedComponent, "function");
});

test("EntityMutationHockFactory's hockedComponent should be an auto request", tt => {
    tt.is(hockedComponent(state => state).displayName, "Connect(MutationHock())");
});

test("EntityMutationHockFactory's hocked component will be given props.onMutate", tt => {
    const Child = (props) => {
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(PASS, {})(Child);
    var ComponentB = EntityMutationHockFactory(PASS, {})(PASS, {onMutateProp: "MUTATE"})(Child);

    tt.is(typeof shallow(<Component store={STORE}/>).dive().prop('onMutate'), 'function');
    tt.is(typeof shallow(<ComponentB store={STORE}/>).dive().prop('onMutate'), 'undefined');
    tt.is(typeof shallow(<ComponentB store={STORE}/>).dive().prop('MUTATE'), 'function');
});


test("EntityMutationHockFactory will update the onMutate with new props", tt => {
    const spy1 = spy();
    const queryCreator = ({spy}) => spy && spy();
    const Child = (props) => {
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(queryCreator, {})(Child);
    var wrapper = shallow(<Component store={STORE}/>);
    wrapper.render();
    tt.is(spy1.callCount, 0);

    wrapper.dive().dive().prop('onMutate')({spy: spy1});
    tt.is(spy1.callCount, 1);
});

test('EntityMutationHockFactory will group props if a `group` config is provided', tt => {
    const Child = (props: Object): React.Element<any> => {
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(NOOP)(NOOP, {group: 'fooGroup', resultKey: 'foo'})(Child);

    function getProp(key: string) {
        return shallow(<Component store={STORE}/>)
            .dive()
            .dive()
            .prop(key);
    }

    tt.is(typeof getProp('fooGroup'), 'object');
    tt.is(typeof getProp('fooGroup').onMutate, 'function');
});


test("EntityMutationHockFactory can be configured to update resultKey based on props", (t: Object) => {
    const actionCreator = spy();
    const Child = () => <div></div>;

    var Component = EntityMutationHockFactory(actionCreator, {})(NOOP, {updateResultKey: (hash, props) => props.id})(Child);
    shallow(<Component store={STORE} id="FOO" />)
        .dive()
        .instance()
        .mutation();

    t.is(actionCreator.firstCall.args[1].resultKey, 'FOO');
});

test('EntityMutationHockFactory will use the result key from `group` if provided', tt => {
    const Child = (props: Object): React.Element<any> => {
        tt.is(props.resultKey, 'bar');
        tt.is(props.fooGroup.resultKey, 'foo');
        tt.is(props.fooGroup.requestState.isFetching, true);
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS)(PASS, {group: 'fooGroup', resultKey: 'foo'})(Child);

    const wrapper = shallow(<Component store={STORE} resultKey="bar" />)
        .dive();

    // invoking the mutation updates the state of the hock so that it will now pass the resultKey `foo` through to its group props
    wrapper.instance().mutation();
    // at this point, the hock should pass the correct request state from the store down to Child
    wrapper.dive().render();
});

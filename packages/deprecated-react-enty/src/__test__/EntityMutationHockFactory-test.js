import React from 'react';
import {spy} from 'sinon';
import {fromJS} from 'immutable';
import EntityMutationHockFactory from '../EntityMutationHockFactory';
import {FetchingState} from 'enty-state/lib/data/RequestState';

global.console.warn = jest.fn();

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

test("EntityMutationHockFactory should return a function", () => {
    expect(typeof entityMutation).toBe("function");
});

test("EntityMutationHockFactory's hockedComponent should be a function", () => {
    expect(typeof hockedComponent).toBe("function");
});

test("EntityMutationHockFactory's hockedComponent should be an auto request", () => {
    expect(hockedComponent(state => state).displayName).toBe("Connect(MutationHock())");
});

test("EntityMutationHockFactory's hocked component will be given props.onMutate", () => {
    const Child = (props) => {
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(PASS, {})(Child);
    var ComponentB = EntityMutationHockFactory(PASS, {})(PASS, {onMutateProp: "MUTATE"})(Child);

    expect(shallow(<Component store={STORE}/>).dive()).toHaveProp('onMutate');
    expect(shallow(<ComponentB store={STORE}/>).dive()).not.toHaveProp('onMutate');
    expect(shallow(<ComponentB store={STORE}/>).dive()).toHaveProp('MUTATE');
});


test("EntityMutationHockFactory will update the onMutate with new props", () => {
    const spy1 = jest.fn();
    const queryCreator = ({spy}) => spy && spy();
    const Child = (props) => {
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(queryCreator, {})(Child);
    var wrapper = shallow(<Component store={STORE}/>);
    wrapper.render();
    expect(spy1).not.toHaveBeenCalled();

    wrapper.dive().dive().prop('onMutate')({spy: spy1});
    expect(spy1).toHaveBeenCalled();
});

test('EntityMutationHockFactory will group props if a `group` config is provided', () => {
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

    expect(typeof getProp('fooGroup')).toBe('object');
    expect(typeof getProp('fooGroup').onMutate).toBe('function');
});


test("EntityMutationHockFactory can be configured to update resultKey based on props", () => {
    const actionCreator = spy();
    const Child = () => <div></div>;

    var Component = EntityMutationHockFactory(actionCreator, {})(NOOP, {updateResultKey: (hash, props) => props.id})(Child);
    shallow(<Component store={STORE} id="FOO" />)
        .dive()
        .instance()
        .mutation();

    expect(actionCreator.firstCall.args[1].resultKey).toBe('FOO');
});

test('EntityMutationHockFactory will use the result key from `group` if provided', () => {
    const checkProps = jest.fn();
    const Child = (props: Object): React.Element<any> => {
        expect(props.resultKey).toBe('bar');
        expect(props.fooGroup.resultKey).toBe('foo');
        expect(props.fooGroup.requestState.type).toBe('Fetching');
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS)(PASS, {group: 'fooGroup', resultKey: 'foo'})(Child);

    const wrapper = shallow(<Component store={STORE} resultKey="bar" />)
        .dive();

    // invoking the mutation updates the state of the hock so that it will now pass the resultKey `foo` through to its group props
    wrapper.instance().mutation();
    wrapper.update();
    // at this point, the hock should pass the correct request state from the store down to Child
    wrapper.dive().render();
});

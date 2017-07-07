import test from 'ava';
import React from 'react';
import {shallow} from 'enzyme';
import {spy} from 'sinon';
import {fromJS} from 'immutable';
import EntityMutationHockFactory from '../EntityMutationHockFactory';
import {FetchingState} from '../RequestState';

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
var entityQuery = EntityMutationHockFactory(PASS);
var hockedComponent = entityQuery(QUERY_CREATOR, ['keys']);

test("EntityMutationHockFactory should return a function", tt => {
    tt.is(typeof entityQuery, "function");
});

test("EntityMutationHockFactory's hockedComponent should be a function", tt => {
    tt.is(typeof hockedComponent, "function");
});

test("EntityMutationHockFactory's hockedComponent should be an auto request", tt => {
    tt.is(hockedComponent().displayName, "Connect(MutationHock())");
});

test("EntityMutationHockFactory's hocked component will be given props.onMutate", tt => {
    const Child = (props) => {
        // tt.truthy(props.requestState instanceof FetchingState().constructor);
        // tt.is(props.onMutate.value("foo"), "foo");
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(PASS, {})(Child);
    var ComponentB = EntityMutationHockFactory(PASS, {})(PASS, {onMutateProp: "MUTATE"})(Child);

    // console.log(shallow(<Component store={STORE}/>).dive().prop('onMutate'));
    tt.is(typeof shallow(<Component store={STORE}/>).dive().prop('onMutate'), 'function');
    tt.is(typeof shallow(<ComponentB store={STORE}/>).dive().prop('onMutate'), 'undefined');
    tt.is(typeof shallow(<ComponentB store={STORE}/>).dive().prop('MUTATE'), 'function');
});


test("EntityMutationHockFactory will update the onMutate with new props", tt => {
    const spy1 = spy();
    const queryCreator = ({spy}) => spy && spy();
    const Child = (props) => {
        props.onMutate({spy: props.spy});
        return <div></div>;
    };

    var Component = EntityMutationHockFactory(PASS, {})(queryCreator, {})(Child);
    var wrapper = shallow(<Component store={STORE}/>);
    wrapper.render();
    tt.is(spy1.callCount, 0);

    // double dive through the hocks to make sure the MutationHock's componentWillReceiveProps fires
    wrapper.dive().dive().setProps({spy: spy1});
    tt.is(spy1.callCount, 1);
});



// test('resultKey is derived either from the metaOverride or a hash of the queryCreator', tt => {
//     const sideEffectA = (aa,bb) => {
//         tt.is(bb.resultKey, 'foo');
//     };

//     const sideEffectB = (aa,bb) => {
//         tt.is(bb.resultKey, 469309513);
//     };

//     var ComponentA = EntityMutationHockFactory(sideEffectA)(PASS, ['keys'], {resultKey: 'foo'})(PASS);
//     var ComponentB = EntityMutationHockFactory(sideEffectB)(PASS, ['keys'])(PASS);

//     shallow(<ComponentA store={STORE}/>).dive();
//     shallow(<ComponentB store={STORE}/>).dive();
// });


// test('requestState will return an empty RequestState for unknown resultKey', tt => {
//     const Child = (props) => {
//         tt.truthy(props.requestState instanceof FetchingState().constructor);
//         tt.is(props.requestState.value('foo'), 'foo');
//         return <div></div>;
//     };

//     var Component = EntityMutationHockFactory(PASS)(PASS, [], {resultKey: 'blah'})(Child);

//     shallow(<Component store={STORE}/>).dive().dive();
// });

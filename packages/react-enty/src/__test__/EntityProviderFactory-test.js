// @flow
import React from 'react';
import EntityProviderFactory from '../EntityProviderFactory';
import EntityApi from '../EntityApi';
import ObjectSchema from 'enty/lib/ObjectSchema';
import compose from 'unmutable/lib/util/compose';
import pipe from 'unmutable/lib/util/pipe';

function render(elementThunk: Function, predicate: Function) {
    return new Promise((resolve, reject) => {
        let wrapper;
        const component = (props) => {
            predicate(props, () => resolve(props));
            return <div/>;
        };
        const Element = elementThunk(component);
        wrapper = mount(<Element/>);
    });
}

test('EntityProviderFactory returns a function', () => {
    expect(typeof EntityProviderFactory({store: null, storeKey: 'test'})).toBe('function');
});

test('EntityProvider can store state', () => {
    const Api = EntityApi(ObjectSchema({}), {
        foo: () => Promise.resolve({foo: 'foo!'})
    });

    return render(
        compose(
            Api.EntityProvider(),
            Api.foo.request({name: 'foo', auto: true})
        ),
        // resolve once foo message is a success
        (props, resolve) => props.foo.requestState.successMap(resolve),
    )
        .then((props) => expect(props.foo.response).toEqual({foo: 'foo!'}));


});

test('Different EntityProviders can be stacked transparently', () => {
    const ApiA = EntityApi(ObjectSchema({}), {
        foo: () => Promise.resolve({foo: 'foo!'})
    });
    const ApiB = EntityApi(ObjectSchema({}), {
        bar: () => Promise.resolve({bar: 'bar!'})
    });

    return render(
        compose(
            ApiA.EntityProvider(),
            ApiB.EntityProvider(),
            ApiA.foo.request({name: 'foo', auto: true}),
            ApiB.bar.request({name: 'bar', auto: true})
        ),
        // resolve the render promise when both
        // request states are success
        (props, resolve) => props.foo.requestState
            .successFlatMap(() => props.bar.requestState)
            .successMap(resolve)
    )
        .then((props) => {
            expect(props.foo.response).toEqual({foo: 'foo!'});
            expect(props.bar.response).toEqual({bar: 'bar!'});
        })
});

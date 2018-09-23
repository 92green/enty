// @flow
import React from 'react';
import EntityProviderFactory from '../EntityProviderFactory';
import EntityApi from '../EntityApi';
import ObjectSchema from 'enty/lib/ObjectSchema';
import composeWith from 'unmutable/lib/util/composeWith';
import pipe from 'unmutable/lib/util/pipe';

function render(element, predicate, hocs = _ => _) {
    return new Promise((resolve, reject) => {
        let wrapper;
        const component = composeWith(hocs, (props) => {
            predicate(props, () => resolve(props, wrapper), () => reject(props, wrapper));
            return <div/>;
        });
        wrapper = mount(element(component));
    });
}

test('EntityProviderFactory returns a function', () => {
    expect(typeof EntityProviderFactory({store: null, storeKey: 'test'})).toBe('function');
});

test('EntityProvider can store state', () => {
    const Schema = ObjectSchema({});
    const Api = EntityApi(Schema, {
        foo: () => Promise.resolve({foo: 'foo!'})
    });

    return render(
        (Component) => <Api.EntityProvider><Component/></Api.EntityProvider>,
        (props, resolve) => props.foo.requestState.successMap(resolve),
        Api.foo.request({name: 'foo', auto: true})
    )
        .then((props) => expect(props.foo.response).toEqual({foo: 'foo!'}));


});

test('Different EntityProviders can be stacked transparently', () => {
    const SchemaA = ObjectSchema({});
    const SchemaB = ObjectSchema({});
    const ApiA = EntityApi(SchemaA, {
        foo: () => Promise.resolve({foo: 'foo!'})
    });
    const ApiB = EntityApi(SchemaA, {
        bar: () => Promise.resolve({bar: 'bar!'})
    });

    return render(
        (Component) => <ApiA.EntityProvider>
            <ApiB.EntityProvider>
                <Component/>
            </ApiB.EntityProvider>
        </ApiA.EntityProvider>,
        (props, resolve) => props.foo.requestState
            .successFlatMap(() => props.bar.requestState)
            .successMap(resolve),
        pipe(
            ApiA.foo.request({name: 'foo', auto: true}),
            ApiB.bar.request({name: 'bar', auto: true})
        )
    )
        .then((props) => {
            expect(props.foo.response).toEqual({foo: 'foo!'});
            expect(props.bar.response).toEqual({bar: 'bar!'});
        })
});

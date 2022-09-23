import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema} from 'enty';
import {useEffect} from 'react';
import {asyncUpdate, ExpectsMessage} from './RequestSuite';
import {mount} from 'enzyme';
import Hash from '../util/Hash';

describe('exports', () => {
    const api = EntityApi(
        {
            foo: () => Promise.resolve(),
            bar: {
                baz: () => Promise.resolve()
            }
        },
        new ObjectSchema({})
    );

    it('will export the api shape', () => {
        const useRequest = expect.any(Function);
        const Provider = expect.any(Function);
        const ProviderHoc = expect.any(Function);

        expect(api).toMatchObject({
            Provider,
            ProviderHoc,
            foo: {
                useRequest
            },
            bar: {
                baz: {
                    useRequest
                }
            }
        });
    });
});

describe('Provider', () => {
    it('will transparently stack providers', () => {
        const A = EntityApi(
            {
                foo: () => Promise.resolve()
            },
            new ObjectSchema({})
        );

        const B = EntityApi(
            {
                foo: () => Promise.resolve()
            },
            new ObjectSchema({})
        );
        const Child = () => null;

        expect(() =>
            mount(
                <A.Provider>
                    <B.Provider>
                        <Child />
                    </B.Provider>
                </A.Provider>
            )
        ).not.toThrow();
    });
});

it('can request and render without a schema', async () => {
    const {foo, Provider} = EntityApi({
        foo: () => Promise.resolve('FOO!')
    });

    const Child = () => {
        const message = foo.useRequest();
        useEffect(() => {
            message.request();
        }, []);
        return <ExpectsMessage message={message} />;
    };

    const wrapper = mount(
        <Provider>
            <Child />
        </Provider>
    );
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess('FOO!');
});

it('can log reducer cycles', async () => {
    const log = jest.spyOn(console, 'log').mockImplementation(() => {});

    const {foo, Provider} = EntityApi({
        foo: () => Promise.resolve('FOO!')
    });

    const Child = () => {
        const message = foo.useRequest();
        useEffect(() => {
            message.request();
        }, []);
        return <ExpectsMessage message={message} />;
    };

    const wrapper = mount(
        <Provider debug={true}>
            <Child />
        </Provider>
    );
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess('FOO!');
    log.mockReset();
});

it('will merge provider meta with api function meta', async () => {
    const baseMeta = {foo: 'bar!'};
    const api = EntityApi({
        foo: async (_: undefined, meta) => meta.foo
    });
    const {foo, Provider} = api;

    const Child = () => {
        const message = foo.useRequest();
        useEffect(() => {
            message.request();
        }, []);
        return <ExpectsMessage message={message} />;
    };

    const wrapper = mount(
        <Provider meta={baseMeta}>
            <Child />
        </Provider>
    );
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess('bar!');
});

it('responseKeys will be different based on path', async () => {
    const baseMeta = {foo: 'bar!'};

    // set responses keys from meta
    let fooResponseKey = null;
    let barResponseKey = null;
    const Api = EntityApi({
        foo: async (_: undefined, meta) => (fooResponseKey = meta.responseKey),
        bar: async (_: undefined, meta) => (barResponseKey = meta.responseKey)
    });

    // Even though the keys are the same their responses should be different
    const Child = () => {
        const fooMessage = Api.foo.useRequest({key: 'same'});
        const barMessage = Api.bar.useRequest({key: 'same'});
        useEffect(() => {
            fooMessage.request();
            barMessage.request();
        }, []);
        return null;
    };

    const wrapper = mount(
        <Api.Provider meta={baseMeta}>
            <Child />
        </Api.Provider>
    );
    await asyncUpdate(wrapper);

    // Response keys should not be the same
    expect(fooResponseKey).not.toBe(barResponseKey);
});

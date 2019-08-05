// @flow
import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema} from 'enty';
import {ArraySchema} from 'enty';
import {EntitySchema} from 'enty';
import {useEffect} from 'react';
import {asyncUpdate, ExpectsMessage} from './RequestSuite';

describe('exports', () => {

    const api = EntityApi({
        foo: () => Promise.resolve(),
        bar: {
            baz: () => Promise.resolve()
        }
    }, new ObjectSchema({}));

    it('will export the api shape', () => {
        const requestHoc = expect.any(Function);
        const useRequest = expect.any(Function);
        const Provider = expect.any(Function);
        const ProviderHoc = expect.any(Function);

        expect(api).toMatchObject({
            Provider,
            ProviderHoc,
            foo: {
                requestHoc,
                useRequest
            },
            bar: {
                baz: {
                    requestHoc,
                    useRequest
                }
            }
        });
    });

});

describe('Provider', () => {

    it('will transparently stack providers', () => {
        const A = EntityApi({
            foo: () => Promise.resolve()
        }, new ObjectSchema({}));

        const B = EntityApi({
            foo: () => Promise.resolve()
        }, new ObjectSchema({}));
        const Child = () => null;

        expect(() => mount(<A.Provider>
            <B.Provider>
                <Child/>
            </B.Provider>
        </A.Provider>)).not.toThrow();
    });

});

it('can request and render without a schema', async () => {
    const {foo, Provider} = EntityApi({
        foo: () => Promise.resolve('FOO!')
    });

    const Child = () => {
        const message = foo.useRequest();
        useEffect(() => {
            message.onRequest();
        }, []);
        return <ExpectsMessage message={message} />;
    };

    const wrapper = mount(<Provider><Child/></Provider>);
    expect(wrapper).toBeFetching();
    await asyncUpdate(wrapper);
    expect(wrapper).toBeSuccess('FOO!');
});

it.todo('provides a way to remove entities', async () => {
    //const response = [{id: 'a'}, {id: 'b'}, {id: 'c'}];
    //const {foo, useRemove, Provider} = EntityApi(
        //{
            //foo: () => Promise.resolve(response)
        //},
        //new ArraySchema(new EntitySchema('foo', {shape: {}}))
    //);

    //const Child = () => {
        //const message = foo.useRequest();
        //const remove = useRemove();

        //useEffect(() => {
            //message.onRequest();
        //}, []);

        //return <div>
            //<button className="remove" onClick={() => remove('foo', 'b')} />
            //<ExpectsMessage message={message} />
        //</div>;
    //};

    //const wrapper = mount(<Provider><Child/></Provider>);
    //expect(wrapper).toBeFetching();
    //await asyncUpdate(wrapper);
    //expect(wrapper).toBeSuccess(response);
    //wrapper.find('.remove').simulate('click');
    //await asyncUpdate(wrapper);
    //expect(wrapper).toBeSuccess(response);
});

// @flow
import React from 'react';
import EntityApi from '../EntityApi';
import {ObjectSchema} from 'enty';

describe('exports', () => {

    const api = EntityApi(ObjectSchema({}), {
        foo: () => Promise.resolve(),
        bar: {
            baz: () => Promise.resolve()
        }
    });

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
        const A = EntityApi(ObjectSchema({}), {
            foo: () => Promise.resolve(),
        });
        const B = EntityApi(ObjectSchema({}), {
            foo: () => Promise.resolve(),
        });
        const Child = () => null;

        expect(() => mount(<A.Provider>
            <B.Provider>
                <Child/>
            </B.Provider>
        </A.Provider>)).not.toThrow();
    });

});


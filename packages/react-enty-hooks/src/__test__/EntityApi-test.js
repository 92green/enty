// @flow
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
    });

    it('will pass props.initialState to the reducer', () => {
    });

});

describe('ProviderHoc', () => {

    it('will pass props.initialState to the reducer', () => {
    });

    it('will remove props.initialState from children', () => {
    });

});

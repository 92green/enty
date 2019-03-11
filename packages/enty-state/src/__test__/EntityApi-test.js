//@flow
import sinon from 'sinon';
import {Map} from 'immutable';
import EntityApi from '../EntityApi';
import ObjectSchema from 'enty/lib/ObjectSchema';
import createAllRequestAction from '../api/createAllRequestAction';
import createRequestAction from '../api/createRequestAction';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);


describe('api construction', () => {
    var api = EntityApi(ObjectSchema({}), {
        resolve: RESOLVE,
        reject: REJECT,
        foo: {
            bar: RESOLVE
        }
    });

    it('will maintain the same shape as provided', () => {
        expect(typeof api.foo.bar.request).toBe('function');
        expect(typeof api.resolve.request).toBe('function');
        expect(typeof api.reject.request).toBe('function');
    });

    it('will add an EntityProvider', () => {
        expect(typeof api.EntityProvider).toBe('function');
    });

    it('will set the reducer and store on an _enty key', () => {
        expect(typeof api._enty.store).toBe('object');
        expect(typeof api._enty.reducer).toBe('function');
    });
});


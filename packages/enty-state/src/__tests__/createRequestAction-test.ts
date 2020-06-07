import {ObjectSchema} from 'enty';
import createRequestAction from '../createRequestAction';
import EntityStore from '../EntityStore';
jest.mock('../EntityStore');

const payload = 'PAYLOAD';
const meta = {key: '1234'};
const observable = (fn) => ({
    subscribe: fn
});

describe('observable support', () => {
    it('will subscribe to observable-like objects', () => {
        const subscribe = jest.fn();
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () => observable(subscribe));

        request(payload, meta);
        expect(subscribe).toHaveBeenCalled();
    });

    it('will auto trigger fetching update', () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () => observable(() => null));
        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
    });

    it('can trigger multiple success updates via next', () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () =>
            observable((sub) => {
                sub.next('1');
                sub.next('2');
            })
        );

        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', '1');
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', '2');
    });

    it('can trigger error update via error', () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () =>
            observable((sub) => {
                sub.error('ERROR');
            })
        );

        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'error', 'ERROR');
    });

    it('will trigger receive update via complete', () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () =>
            observable((sub) => {
                sub.complete('1');
            })
        );

        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', '1');
    });
});

describe('promise support', () => {
    it('will auto trigger fetching update', () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () => Promise.resolve());
        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
    });

    it('can trigger success update via a resolved promise', async () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () => Promise.resolve('DATA'));
        await request(payload, meta);
        expect(store.updateRequest).toHaveBeenLastCalledWith('1234', 'success', 'DATA');
    });

    it('can trigger error update via a rejected promise', async () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, () => Promise.reject('BORKD'));
        try {
            await request(payload, meta);
        } catch (e) {
            expect(store.updateRequest).toHaveBeenLastCalledWith('1234', 'error', 'BORKD');
        }
    });
});

describe('async generators', () => {
    it('will auto trigger fetching update', async () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, async function* () {});
        request(payload, meta);
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
    });

    it('can trigger success update via yielding data', async () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, async function* () {
            yield 'foo';
            yield 'bar';
        });
        request(payload, meta);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', 'foo');
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', 'bar');
    });

    it('can trigger error update via throwing in the generator', async () => {
        const store = new EntityStore({api: {}, schema: new ObjectSchema({})});
        const request = createRequestAction(store, async function* () {
            yield 'foo';
            throw 'bar';
        });
        request(payload, meta);
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'pending', {});
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'success', 'foo');
        expect(store.updateRequest).toHaveBeenCalledWith('1234', 'error', 'bar');
    });
});

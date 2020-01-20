// @flow
import createRequestAction from '../createRequestAction';

const payload = 'PAYLOAD';
const meta = 'META';

describe('observable support', () => {
    const observable = (fn) => ({
        subscribe: fn
    });
    const payload = 'PAYLOAD';
    const meta = 'META';

    test('createRequestAction will subscribe to observable like objects', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const subscribe = jest.fn();
        const request = createRequestAction(() => observable(subscribe));

        let result = request(payload, meta)(dispatch, getState);
        expect(subscribe).toHaveBeenCalled();
        expect(typeof result.then).toBe('function');
    });

    it('will auto trigger fetching action', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => observable(() => null));

        request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: null, type: 'ENTY_FETCH'});
    });

    it('can trigger multiple success actions via next', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => observable((sub) => {
            sub.next('1');
            sub.next('2');
        }));

        let result = request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '1', type: 'ENTY_RECEIVE'});
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '2', type: 'ENTY_RECEIVE'});
        expect(await result).toBe('1');
    });

    it('can trigger error action via error', async () => {
        expect.assertions(2);
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => observable((sub) => {
            sub.error('ERROR');
        }));

        return request(payload, meta)(dispatch, getState)
            .catch((error) => {
                expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: 'ERROR', type: 'ENTY_ERROR'});
                expect(error).toBe('ERROR');
            });
    });

    it('will trigger receive action via complete', async () => {
        const dispatch = jest.fn();
        const request = createRequestAction(() => observable((sub) => {
            sub.complete('1');
        }));

        let result = request(payload, meta)(dispatch, jest.fn());
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '1', type: 'ENTY_RECEIVE'});
        expect(await result).toBe('1');
    });

});

describe('promise support', () => {
    it('will auto trigger fetching action', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => Promise.resolve());
        let result = request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: null, type: 'ENTY_FETCH'});
        expect(typeof result.then).toBe('function');
    });

    it('can trigger success action via a resolved promise', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => Promise.resolve('DATA'));
        let resultPayload = await request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenLastCalledWith({meta: 'META', payload: 'DATA', type: 'ENTY_RECEIVE'});
        expect(resultPayload).toBe('DATA');
    });

    it('can trigger error action via a rejected promise', () => {
        expect.assertions(2);
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction(() => Promise.reject('BORKD'));
        const meta = {responseKey: '123'};
        return request(payload, meta)(dispatch, getState)
            .catch((error) => {
                expect(dispatch).toHaveBeenLastCalledWith({meta, payload: 'BORKD', type: 'ENTY_ERROR'});
                expect(error).toBe('BORKD');
            });
    });

});



describe('general', () => {

    it('returns a function accepts payload/meta that returns a redux thunk', () => {
        const payloadFunction = createRequestAction(() => Promise.resolve());
        const thunk = payloadFunction('bar', {responseKey: '123'});

        expect(typeof payloadFunction).toBe('function');
        expect(typeof thunk).toBe('function');
    });


});

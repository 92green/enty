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
        const request = createRequestAction('FOO', () => observable(subscribe));

        request(payload, meta)(dispatch, getState);
        expect(subscribe).toHaveBeenCalled();
    });

    it('will auto trigger fetching action', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => observable(() => null));

        request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: null, type: 'FOO_FETCH'});
    });

    it('can trigger multiple success actions via next', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => observable((sub) => {
            sub.next('1');
            sub.next('2');
        }));

        request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '1', type: 'FOO_RECEIVE'});
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '2', type: 'FOO_RECEIVE'});
    });

    it('can trigger error action via error', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => observable((sub) => {
            sub.error('ERROR');
        }));

        request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: 'ERROR', type: 'FOO_ERROR'});
    });

    it('will trigger receive action via complete', () => {
        const dispatch = jest.fn();
        const request = createRequestAction('FOO', () => observable((sub) => {
            sub.complete('1');
        }));

        request(payload, meta)(dispatch, jest.fn());
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: '1', type: 'FOO_RECEIVE'});
    });

});

describe('promise support', () => {
    it('will auto trigger fetching action', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => Promise.resolve());
        request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith({meta: 'META', payload: null, type: 'FOO_FETCH'});
    });

    it('can trigger success action via a resolved promise', async () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => Promise.resolve('DATA'));
        await request(payload, meta)(dispatch, getState);
        expect(dispatch).toHaveBeenLastCalledWith({meta: 'META', payload: 'DATA', type: 'FOO_RECEIVE'});
    });

    it('can trigger error action via a rejected promise', () => {
        const dispatch = jest.fn();
        const getState = jest.fn();
        const request = createRequestAction('FOO', () => Promise.reject('BORKD'));
        const meta = {reponseKey: '123'};
        return request(payload, meta)(dispatch, getState)
            .catch(() => {
                expect(dispatch).toHaveBeenLastCalledWith({meta, payload: 'BORKD', type: 'FOO_ERROR'});
            });
    });

});



describe('general', () => {

    it('returns a function accepts payload/meta that returns a redux thunk', () => {
        const payloadFunction = createRequestAction('FOO', () => Promise.resolve());
        const thunk = payloadFunction('bar', {reponseKey: '123'});

        expect(typeof payloadFunction).toBe('function');
        expect(typeof thunk).toBe('function');
    });


});

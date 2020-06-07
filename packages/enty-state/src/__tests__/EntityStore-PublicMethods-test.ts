import EntityStore from '../EntityStore';
import {ObjectSchema, EntitySchema, REMOVED_ENTITY} from 'enty';

const ensureNotify = <A extends Array<any>>(method: string, args: A) => {
    const callback = jest.fn();
    const store = new EntityStore({
        api: {}
    });
    store.subscribe(callback);

    store[method](...args);
    expect(callback).toHaveBeenCalled();
};

describe('update', () => {
    it('can normalize a payload', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        expect(store._entity.person).toBe(undefined);
        store.update({person: {id: 'foo', name: 'Derek'}});
        expect(store.getEntity('person', 'foo')).toEqual({id: 'foo', name: 'Derek'});
        store.update({person: {id: 'foo', age: 27}});
        expect(store.getEntity('person', 'foo')).toEqual({id: 'foo', name: 'Derek', age: 27});
    });

    it('will notify', () => ensureNotify('update', [{}]));
});

describe('updateRequest', () => {
    it('will set state to re/fetching if given pending, and not override result or error', () => {
        const store = new EntityStore({api: {}});
        store.updateRequest('123', 'pending', {});
        expect(store._request['123'].state).toBe('fetching');
        store.updateRequest('123', 'success', {foo: 1});
        store.updateRequest('123', 'error', 'ERROR');
        store.updateRequest('123', 'pending', {});
        expect(store.getRequest('123')).toEqual({
            state: 'refetching',
            error: 'ERROR',
            result: {foo: 1}
        });
    });

    it('will set state to success, normalize payloads, and not override errors', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        store.updateRequest('123', 'success', {person: {id: 'foo', name: 'Derek'}});
        expect(store.getRequest('123')).toEqual({
            state: 'success',
            error: null,
            result: {person: {id: 'foo', name: 'Derek'}}
        });
        store.updateRequest('123', 'error', 'ERR!');
        store.updateRequest('123', 'success', {person: {id: 'foo', age: 27}});
        expect(store.getRequest('123')).toEqual({
            state: 'success',
            error: 'ERR!',
            result: {person: {id: 'foo', name: 'Derek', age: 27}}
        });
    });

    it('it will set state to error without overriding result', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        store.updateRequest('123', 'success', {person: {id: 'foo', name: 'Derek'}});
        expect(store.getRequest('123')).toEqual({
            state: 'success',
            error: null,
            result: {person: {id: 'foo', name: 'Derek'}}
        });
        store.updateRequest('123', 'error', 'ERR!');
        expect(store.getRequest('123')).toEqual({
            state: 'error',
            error: 'ERR!',
            result: {person: {id: 'foo', name: 'Derek'}}
        });
    });

    it('will notify', () => ensureNotify('updateRequest', ['123', 'pending', {}]));
});

describe('removeEntity', () => {
    it('will replace entities with REMOVED_ENTITIY', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });
        store.update({person: {id: 'foo'}});
        expect(store._entity.person.foo).toEqual({id: 'foo'});
        store.removeEntity('person', 'foo');
        expect(store._entity.person.foo).toEqual(REMOVED_ENTITY);
    });

    it('will not remove non-existing entities', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        // Dont create dummy entity types
        store.removeEntity('foo', 'bar');
        expect(store._entity.foo).toBeUndefined();

        // Even if the entity type exists dont create dummy removed entities
        store.update({person: {id: 'foo'}});
        store.removeEntity('person', 'bar');
        expect(store._entity.person.bar).not.toBe(REMOVED_ENTITY);
    });

    it('will notify', () => ensureNotify('removeEntity', ['person', '123']));
});

describe('removeRequest', () => {
    it('remove reset result back to empty', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });
        store.updateRequest('123', 'error', 'ERR!');
        expect(store.getRequest('123')).toEqual({state: 'error', result: null, error: 'ERR!'});
        store.removeRequest('123');
        expect(store.getRequest('123')).toEqual({state: 'empty', result: null, error: null});
    });

    it('will notify subscribers', () => ensureNotify('removeRequest', ['123']));
});

describe('getRequest', () => {
    it('will return an empty request if the key does not exist', () => {
        const store = new EntityStore({api: {}});
        expect(store.getRequest('789')).toEqual({state: 'empty'});
    });
});

describe('getEntity', () => {
    it('will not try and denormalize non-existing entities', () => {
        const store = new EntityStore({api: {}});
        expect(store.getEntity('person', '123')).toEqual(undefined);
    });
});

describe('has(Request|Entity)', () => {
    it('will return true for existing entities', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        expect(store.hasEntity('person', 'foo')).toBeFalsy();
        store.update({person: {id: 'foo', name: 'Derek'}});
        expect(store.hasEntity('person', 'foo')).toBeTruthy();
    });

    it('will return a true for existing requests', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        expect(store.hasRequest('123')).toBeFalsy();
        store.updateRequest('123', 'success', {});
        expect(store.hasRequest('123')).toBeTruthy();
    });
});

describe('getters', () => {
    it('returns the private api key', () => {
        const api = {};
        const store = new EntityStore({api});
        expect(store.api).not.toBe(api);
        expect(store.api).toEqual(api);
    });
});

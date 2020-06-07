import EntityStore from '../EntityStore';
import {ObjectSchema, EntitySchema} from 'enty';

describe('constructor', () => {
    it('can set defaults', () => {
        const store = new EntityStore({
            api: {}
        });

        expect(store._responseCount).toBe(0);
        expect(store._rootSchema instanceof ObjectSchema).toBeTruthy();
        expect(store._callback).toEqual([]);
    });

    it('will visit the api with createRequestAction', () => {
        const store = new EntityStore({
            schema: new ObjectSchema({}),
            api: {
                foo: jest.fn(),
                bar: {baz: jest.fn()}
            }
        });

        expect(typeof store._api.foo.raw).toBe('function');
        expect(typeof store._api.bar).toBe('object');
        expect(typeof store._api.bar.baz.raw).toBe('function');
    });
});

describe('_recurseApi', () => {
    it('will recurse through deep object trees', () => {
        const fn = () => {};
        const store = new EntityStore({
            schema: new ObjectSchema({}),
            api: {
                foo: {
                    bar: {
                        baz: fn
                    },
                    qux: fn
                }
            }
        });
        expect(store.api.foo.bar.baz.raw).toBe(fn);
        expect(store.api.foo.qux.raw).toBe(fn);
    });
});

describe('_normalizePayload / _denormalize', () => {
    it('will normalize a payload and return the result', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        expect(store._entity.person).toBe(undefined);
        const result1 = store._normalizePayload({person: {id: 'foo'}});
        expect(store._entity.person).toEqual({foo: {id: 'foo'}});
        const result2 = store._normalizePayload({person: {id: 'foo', name: 'Fooser'}});
        expect(store._entity.person).toEqual({foo: {id: 'foo', name: 'Fooser'}});

        expect(result1).toEqual({person: 'foo'});
        expect(result2).toEqual({person: 'foo'});
    });

    it('can denormalize by the rootSchema', () => {
        const person = new EntitySchema({name: 'person'});
        const store = new EntityStore({
            schema: new ObjectSchema({person}),
            api: {}
        });

        const personA = {id: 'foo', name: 'Derek'};
        const personB = {id: 'foo', age: 27};

        expect(store._denormalize({person: 'foo'})).toEqual({});
        const result1 = store._normalizePayload({person: personA});
        expect(store._denormalize(result1)).toEqual({person: personA});
        const result2 = store._normalizePayload({person: personB});
        expect(store._denormalize(result2)).toEqual({person: {...personA, ...personB}});
    });
});

describe('subscribe / _notifiy', () => {
    it('lets a callback subscribe to changes', () => {
        const cb1 = jest.fn();
        const cb2 = jest.fn();
        const store = new EntityStore({schema: new ObjectSchema({}), api: {}});
        store.subscribe(cb1);
        store.subscribe(cb2);
        expect(store._callback.length).toBe(2);
        store.update({});
        expect(cb1).toHaveBeenCalled();
        expect(cb2).toHaveBeenCalled();
    });
});

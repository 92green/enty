import React from 'react';
import ProviderFactory from '../ProviderFactory';
import {EntitySchema, ObjectSchema} from 'enty';
import {mount} from 'enzyme';
import {ProviderContextType} from '../util/definitions';

type TestFn = (child: (props: {context: ProviderContextType | null}) => null) => any;
const getContext = (testFn: TestFn): ProviderContextType => {
    const ExpectsContext = () => null;
    const Component = testFn(ExpectsContext);
    return mount(<Component />)
        .find('ExpectsContext')
        .prop('context');
};

const expectContext = (testFn: TestFn) => {
    return expect(getContext(testFn));
};

describe('Factory', () => {
    it('returns a hock, component and context', () => {
        expect(ProviderFactory({})).toMatchObject({
            Provider: expect.any(Function),
            ProviderHoc: expect.any(Function),
            Context: expect.any(Object)
        });
    });
});

describe('Component', () => {
    it('applies the intial state to a context', () => {
        const {Provider, Context} = ProviderFactory({});

        expectContext((Child) => () => {
            return (
                <Provider initialState={{entities: {foo: 'component'}}}>
                    <Context.Consumer children={(context) => <Child context={context} />} />
                </Provider>
            );
        }).toMatchObject([
            {
                entities: {foo: 'component'},
                error: {},
                requestState: {},
                response: {},
                schemas: {},
                stats: {responseCount: 0}
            },
            expect.any(Function),
            {}
        ]);
    });

    it('applies the meta to the context', () => {
        const {Provider, Context} = ProviderFactory({});

        expectContext((Child) => () => {
            return (
                <Provider meta={{foo: 'bar'}}>
                    <Context.Consumer children={(context) => <Child context={context} />} />
                </Provider>
            );
        }).toMatchObject([
            {
                error: {},
                requestState: {},
                response: {},
                schemas: {},
                stats: {responseCount: 0}
            },
            expect.any(Function),
            {foo: 'bar'}
        ]);
    });

    it('will reduce results into the initial state', () => {
        const foo = new EntitySchema('foo');
        const bar = new EntitySchema('bar');
        const schema = new ObjectSchema({foo, bar});
        const results = [
            {responseKey: 'a', payload: {foo: {id: 'foo1', name: 'foooo'}}},
            {responseKey: 'b', payload: {bar: {id: 'bar1', name: 'barrr'}}}
        ];
        const {Provider, Context} = ProviderFactory({schema, results});

        const [state] = getContext((Child) => () => {
            return (
                <Provider>
                    <Context.Consumer children={(context) => <Child context={context} />} />
                </Provider>
            );
        });

        expect(state.requestState.a.isSuccess).toBe(true);
        expect(state.response.a.foo).toBe('foo1');
        expect(state.entities.foo.foo1.name).toBe('foooo');
        expect(state.requestState.b.isSuccess).toBe(true);
        expect(state.response.b.bar).toBe('bar1');
        expect(state.entities.bar.bar1.name).toBe('barrr');
    });

    it('will apply types of initial actions', () => {
        const foo = new EntitySchema('foo');
        const schema = new ObjectSchema({foo});
        const results = [
            {
                type: 'ENTY_ERROR' as const,
                responseKey: 'a',
                payload: {foo: {id: 'foo1', name: 'foooo'}}
            }
        ];
        const {Provider, Context} = ProviderFactory({schema, results});

        const [state] = getContext((Child) => () => {
            return (
                <Provider>
                    <Context.Consumer children={(context) => <Child context={context} />} />
                </Provider>
            );
        });

        expect(state.requestState.a.isError).toBe(true);
        expect(state.requestState.a.isSuccess).toBeUndefined();
    });
});

describe('Hoc', () => {
    it('returns a config => component => props function', () => {
        const {ProviderHoc, Context} = ProviderFactory({});

        expectContext((Child) => {
            const withInitialState = (Component: any) => (props: any) =>
                <Component {...props} initialState={{entities: {foo: 'hoc'}}} />;
            const withProvider = ProviderHoc();
            return withInitialState(
                withProvider(() => (
                    <Context.Consumer children={(context) => <Child context={context} />} />
                ))
            );
        }).toMatchObject([
            {
                entities: {foo: 'hoc'},
                error: {},
                requestState: {},
                response: {},
                schemas: {},
                stats: {responseCount: 0}
            },
            expect.any(Function),
            {}
        ]);
    });
});

describe('Debugging', () => {
    it('will log reducer state if debug prop is provided', () => {
        const log = jest.spyOn(console, 'log').mockImplementation(() => {});
        const {Provider} = ProviderFactory({});
        mount(<Provider debug />);
        expect(log).toHaveBeenCalled();
        log.mockRestore();
    });
});

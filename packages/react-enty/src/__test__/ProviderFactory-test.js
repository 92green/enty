import ProviderFactory from '../ProviderFactory';
import composeWith from 'unmutable/composeWith';

const expectContext = (testFn) => {
    const ExpectsContext = () => null;
    const Component = testFn(ExpectsContext);

    return expect(mount(<Component />).find('ExpectsContext').prop('context'));

}

describe('Factory', () => {

    it('returns a hock, component and context', () => {

        expect(ProviderFactory({reducer: aa => aa})).toMatchObject({
            Provider: expect.any(Function),
            ProviderHoc: expect.any(Function),
            Context: expect.any(Object)
        });

    });

});

describe('Component', () => {
    it('applies the reducer and intial state to a context', () => {
        const {Provider, Context} = ProviderFactory({
            reducer: (state, action) => `${state}:${action.type}`
        });

        expectContext((Child) => () => {
            return <Provider initialState="component">
                <Context.Consumer
                    children={(context) => <Child context={context}/>}
                />
            </Provider>;
        }).toEqual([
            'component:ENTY_INIT',
            expect.any(Function)
        ]);
    });
});

describe('Hoc', () => {

    it('returns a config => component => props function', () => {
        const {ProviderHoc, Context} = ProviderFactory({
            reducer: (state, action) => `${state}:${action.type}`
        });

        expectContext((Child) => composeWith(
            (Component) => (props) => <Component {...props} initialState="hoc" />,
            ProviderHoc(),
            () => {
                return <Context.Consumer
                    children={(context) => <Child context={context}/>}
                />
            }
        )).toEqual([
            'hoc:ENTY_INIT',
            expect.any(Function)
        ]);


    });

});


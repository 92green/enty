import useReducerThunk from '../useReducerThunk';
import {act, renderHook} from '@testing-library/react-hooks';


describe('useReducerThunk', () => {

    it('will dispatch synchronously if an action returns an object', () => {
        const {result} = renderHook(() => useReducerThunk((aa, bb) => aa + bb, 'foo'));
        const [dispatch] = result.current;
        expect(result.current[0]).toBe('foo');

        act(() => result.current[1]('bar'));
        expect(result.current[0]).toBe('foobar');

        act(() => result.current[1]('baz'));
        act(() => result.current[1]('!'));
        expect(result.current[0]).toBe('foobarbaz!');
    });

    it('will call action with dispatch/getState if it returns a function', () => {
        const {result} = renderHook(() => useReducerThunk((aa, bb) => aa + bb, 'foo'));
        act(() => result.current[1]((dispatch, getState) => {
            expect(typeof dispatch).toBe('function');
            expect(typeof getState).toBe('function');
            expect(getState()).toBe('foo');
            dispatch('bar');
        }));
        expect(result.current[0]).toBe('foobar');
    });

});

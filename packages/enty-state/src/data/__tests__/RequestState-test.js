// @flow
import RequestState from '../RequestState';

describe('RequestState', () => {

    test('map functions will update values', () => {
        function value(state) {
            return state
                .emptyMap(() => 'empty')
                .fetchingMap(() => 'fetching')
                .refetchingMap(() => 'refetching')
                .errorMap(() => 'error')
                .successMap(() => 'success')
                .value();
        }
        expect(value(RequestState.empty())).toBe('empty');
        expect(value(RequestState.fetching())).toBe('fetching');
        expect(value(RequestState.refetching())).toBe('refetching');
        expect(value(RequestState.error())).toBe('error');
        expect(value(RequestState.success())).toBe('success');
    });

    test('variant apis', () => {

        function instance(state) {
            expect(state).toHaveProperty('value');
            expect(state).toHaveProperty('isEmpty');
            expect(state).toHaveProperty('isFetching');
            expect(state).toHaveProperty('isRefetching');
            expect(state).toHaveProperty('isSuccess');
            expect(state).toHaveProperty('isError');
            expect(state).toHaveProperty('emptyMap');
            expect(state).toHaveProperty('emptyFlatMap');
            expect(state).toHaveProperty('fetchingMap');
            expect(state).toHaveProperty('fetchingFlatMap');
            expect(state).toHaveProperty('refetchingMap');
            expect(state).toHaveProperty('refetchingFlatMap');
            expect(state).toHaveProperty('errorMap');
            expect(state).toHaveProperty('errorFlatMap');
            expect(state).toHaveProperty('successMap');
            expect(state).toHaveProperty('successFlatMap');
        }

        // Instance
        instance(RequestState.empty());
        instance(RequestState.fetching());
        instance(RequestState.refetching());
        instance(RequestState.error());
        instance(RequestState.success());

        // Static
        expect(RequestState).toHaveProperty('empty');
        expect(RequestState).toHaveProperty('fetching');
        expect(RequestState).toHaveProperty('refetching');
        expect(RequestState).toHaveProperty('error');
        expect(RequestState).toHaveProperty('success');
    });

});

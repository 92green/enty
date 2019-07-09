import {EmptyState} from '../RequestState';
import {FetchingState} from '../RequestState';
import {RefetchingState} from '../RequestState';
import {ErrorState} from '../RequestState';
import {SuccessState} from '../RequestState';

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
        expect(value(EmptyState())).toBe('empty');
        expect(value(FetchingState())).toBe('fetching');
        expect(value(RefetchingState())).toBe('refetching');
        expect(value(ErrorState())).toBe('error');
        expect(value(SuccessState())).toBe('success');
    });

    test('variant apis', () => {
        function test(state) {
            expect(state).toHaveProperty('map');
            expect(state).toHaveProperty('flatMap');
            expect(state).toHaveProperty('val');
            expect(state).toHaveProperty('value');
            expect(state).toHaveProperty('type');
            expect(state).toHaveProperty('emptyMap');
            expect(state).toHaveProperty('emptyFlatMap');
            expect(state).toHaveProperty('emptyUnit');
            expect(state).toHaveProperty('fetchingMap');
            expect(state).toHaveProperty('fetchingFlatMap');
            expect(state).toHaveProperty('fetchingUnit');
            expect(state).toHaveProperty('refetchingMap');
            expect(state).toHaveProperty('refetchingFlatMap');
            expect(state).toHaveProperty('refetchingUnit');
            expect(state).toHaveProperty('errorMap');
            expect(state).toHaveProperty('errorFlatMap');
            expect(state).toHaveProperty('errorUnit');
            expect(state).toHaveProperty('successMap');
            expect(state).toHaveProperty('successFlatMap');
            expect(state).toHaveProperty('successUnit');
        }

        test(EmptyState());
        test(FetchingState());
        test(RefetchingState());
        test(ErrorState());
        test(SuccessState());
    });

});

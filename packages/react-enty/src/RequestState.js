// @flow

import {StateFunctorFactory} from 'fronads';

/**
 * Mapper description
 */
type RequestStateMapper = (value: *) => *;

/**
 * RequestStateFlatMapper description
 */
type RequestStateFlatMapper = (value: *) => RequestState;

/**
 * RequestStateType description
 */
export type RequestState = {
    emptyFlatMap: (mapper: RequestStateFlatMapper) => RequestState,
    emptyMap: (mapper: RequestStateMapper) => RequestState,
    emptyUnit: (value: *) => RequestState,
    errorFlatMap: (mapper: RequestStateFlatMapper) => RequestState,
    errorMap: (mapper: RequestStateMapper) => RequestState,
    errorUnit: (value: *) => RequestState,
    fetchingFlatMap: (mapper: RequestStateFlatMapper) => RequestState,
    fetchingMap: (mapper: RequestStateMapper) => RequestState,
    fetchingUnit: (value: *) => RequestState,
    refetchingFlatMap: (mapper: RequestStateFlatMapper) => RequestState,
    refetchingMap: (mapper: RequestStateMapper) => RequestState,
    refetchingUnit: (value: *) => RequestState,
    successFlatMap: (mapper: RequestStateFlatMapper) => RequestState,
    successMap: (mapper: RequestStateMapper) => RequestState,
    successUnit: (value: *) => RequestState,
    toEmpty: () => RequestState,
    toError: () => RequestState,
    toFetching: () => RequestState,
    toRefetching: () => RequestState,
    toSuccess: () => RequestState,
    value: (defaultValue: *) => *
};

const RequestStates = StateFunctorFactory(['Empty', 'Fetching', 'Refetching', 'Error', 'Success']);

/**
 * EmptyState description
 */
export const EmptyState: RequestState = RequestStates.EmptyState;

/**
 * FetchingState description
 */
export const FetchingState: RequestState = RequestStates.FetchingState;

/**
 * RefetchingState description
 */
export const RefetchingState: RequestState = RequestStates.RefetchingState;

/**
 * ErrorState description
 */
export const ErrorState: RequestState = RequestStates.ErrorState;

/**
 * SuccessState description
 *
 */
export const SuccessState: RequestState = RequestStates.SuccessState;



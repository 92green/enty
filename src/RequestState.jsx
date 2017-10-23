// @flow

import {StateFunctorFactory} from 'fronads';

export type RequestState = {
    emptyFlatMap: (Function) => RequestState,
    emptyMap: (Function) => RequestState,
    emptyUnit: (*) => RequestState,
    errorFlatMap: (Function) => RequestState,
    errorMap: (Function) => RequestState,
    errorUnit: (*) => RequestState,
    fetchingFlatMap: (Function) => RequestState,
    fetchingMap: (Function) => RequestState,
    fetchingUnit: (*) => RequestState,
    refetchingFlatMap: (Function) => RequestState,
    refetchingMap: RequestState,
    refetchingUnit: (*) => RequestState,
    successFlatMap: (Function) => RequestState,
    successMap: (Function) => RequestState,
    successUnit: (*) => RequestState,
    toEmpty: () => RequestState,
    toError: () => RequestState,
    toFetching: () => RequestState,
    toRefetching: () => RequestState,
    toSuccess: () => RequestState,
    value: (*) => *
};

/**
 * Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo ratione earum molestias aliquam impedit, optio et aspernatur ipsum cum eveniet laboriosam eius sunt, vero culpa rem sequi pariatur quia corporis.
 * @module RequestState
 */

/**
 * EmptyState
 * @name EmptyState
 * @memberof module:RequestState
 */

/**
 * FetchingState
 * @name FetchingState
 * @memberof module:RequestState
 */

/**
 * RefetchingState
 * @name RefetchingState
 * @memberof module:RequestState
 */

/**
 * ErrorState
 * @name ErrorState
 * @memberof module:RequestState
 */

/**
 * SuccessState
 * @name SuccessState
 * @memberof module:RequestState
 */

module.exports = StateFunctorFactory(['Empty', 'Fetching', 'Refetching', 'Error', 'Success']);

// @flow

import {StateFunctorFactory} from 'fronads';

/**
 * RequestState
 */
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
    refetchingMap: (Function) => RequestState,
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
 * Thing
 */
module.exports = StateFunctorFactory(['Empty', 'Fetching', 'Refetching', 'Error', 'Success']);

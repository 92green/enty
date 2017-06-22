import {EmptyState} from './RequestState';

const defaultOptions = {
    stateKey: 'entity'
};

/**
 * @module Selectors
 */

/**
 * Returns the state of a current request. Either fetching, error or not yet requested.
 * @param  {object} state            the current state
 * @param  {string} requestStateKey  either result key or action prefix
 * @return {object}                  the curerent request state
 * @memberof module:Selectors
 */
export default function selectRequestState(state, requestStateKey, options) {
    const {stateKey} = Object.assign({}, defaultOptions, options);
    return state[stateKey]
        .getIn(['_requestState', requestStateKey], EmptyState());
}

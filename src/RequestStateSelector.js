import {RequestEmpty} from 'request-state-monad';


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
export default function selectRequestState(state, requestStateKey) {
    return state
        .entity
        .getIn(['_requestState', requestStateKey], RequestEmpty());
}

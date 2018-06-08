// @flow
import {EmptyState} from './RequestState';
import Logger from './Logger';


/**
 * @module Selectors
 */

/**
 * Returns the state of a current request. Either fetching, error or not yet requested.
 * @param  {object} state            the current state
 * @param  {string} requestStateKey  either result key or action prefix
 * @return {object}                  the curerent request state
 */
export default function selectRequestState(state: Object, requestStateKey: string, options?: * = {}): any {
    const {stateKey = 'entity'} = options;

    Logger.silly('Selecting RequestState:', `${stateKey}._requestState.${requestStateKey}`, state);
    return state[stateKey]
        .getIn(['_requestState', requestStateKey], EmptyState());
}

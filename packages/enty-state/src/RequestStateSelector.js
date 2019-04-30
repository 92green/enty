// @flow
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';
import {EmptyState} from './data/RequestState';
import Logger from './util/Logger';


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
    return pipeWith(
        state,
        getIn([stateKey, '_requestState', requestStateKey], EmptyState())
    );
}

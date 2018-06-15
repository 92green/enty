// @flow
import Logger from './Logger';


/**
 * @module Selectors
 */

/**
 * Returns any errors associated with the current resultKey
 * @param  {object} state            the current state
 * @param  {string} resultKey        a resultKey
 * @return {object}                  the current error
 */
export default function ErrorSelector(state: Object, resultKey: string, options?: * = {}): any {
    const {stateKey = 'entity'} = options;

    Logger.silly('Selecting Error:', `${stateKey}._error.${resultKey}`, state);
    return state[stateKey]
        .getIn(['_error', resultKey]);
}

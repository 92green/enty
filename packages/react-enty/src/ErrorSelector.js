// @flow
import getIn from 'unmutable/lib/getIn';
import pipeWith from 'unmutable/lib/util/pipeWith';
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
    return pipeWith(
        state,
        getIn([stateKey, '_error', resultKey])
    );
}

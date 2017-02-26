import {createRequestActionSet} from '../CreateRequestActions';
import {fromJS, Map} from 'immutable';

/**
 * @module Misc
 */

/**
 * Given the return value of creatRequestActionSet it will log the names of the created action types and creators
 * @param  {object} actionMap map of actions
 * @param  {string} prefix    String to prefix actions types with
 *
 * @memberof module:Misc
 */
export default function logRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(createRequestActionSet(actionMap, prefix)).join('\n'));
}


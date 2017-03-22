// @flow
import {createRequestActionSet} from '../CreateRequestActions';

/**
 * @module Misc
 */

/**
 * Given the return value of creatRequestActionSet it will log the names of the created action types and creators
 * @param {Object} actionMap map of actions
 *
 * @memberof module:Misc
 */
export default function logRequestActionNames(actionMap: Object) {
    console.log(Object.keys(createRequestActionSet(actionMap)).join('\n'));
}

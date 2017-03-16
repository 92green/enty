import {createAction} from 'redux-actions';

/**
 * @module Actions
 */

/**
 * Returns an action creator that will trigger an entity receive
 * @function
 * @memberof module:Actions
 */
export const receiveEntity = createAction('ENTITY_RECEIVE', (payload) => payload, (payload, meta) => meta);


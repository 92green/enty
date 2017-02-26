import {createAction} from 'redux-actions';

/**
 * @module Actions
 */

/**
 * Returns an action creator that takes an entity key path as its payload
 * The entity reducer will then mark that entity as deleted.
 * @function
 * @memberof module:Actions
 */
export const deleteEntity = createAction('ENTITY_DELETE', (payload) => payload, (payload, meta) => meta);

/**
 * Returns an action creator that takes an entity key path as its payload
 * The entity reducer will then mark that entity as NOT deleted.
 *
 * @function
 * @memberof module:Actions
 */
export const undoDeleteEntity = createAction('ENTITY_UNDO_DELETE', (payload) => payload, (payload, meta) => meta);

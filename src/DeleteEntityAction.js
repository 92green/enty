import {createAction} from 'redux-actions';


/**
 * Delete Entity Action
 *
 * Returns an action creator that takes an entity key path as its payload
 * The entity reducer will then mark that entity as deleted.
 */
export const deleteEntity = createAction('ENTITY_DELETE', (payload) => payload, (payload, meta) => meta);

/**
 * Undo Delete Entity Action
 *
 * Returns an action creator that takes an entity key path as its payload
 * The entity reducer will then mark that entity as NOT deleted.
 */
export const undoDeleteEntity = createAction('ENTITY_UNDO_DELETE', (payload) => payload, (payload, meta) => meta);

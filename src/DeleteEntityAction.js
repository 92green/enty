import {createAction} from 'redux-actions';


/**
 * Delete Entity Action
 *
 * Returns an action creator that takes an entity key path as its payload
 * The entity reducer will then mark that entity as deleted.
 */
export default createAction('ENTITY_DELETE', (payload) => payload, (payload, meta) => meta);

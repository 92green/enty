import {createAction} from 'redux-actions';

export default createAction('ENTITY_DELETE', (payload) => payload, (payload, meta) => meta);

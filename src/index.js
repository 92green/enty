
//
// Creators

export {
    createRequestAction,
    createRequestActionSet
} from './CreateRequestActions';

export {
    createEntityReducer
} from './CreateEntityReducer';

export {
    default as createEntityQuery
} from './CreateEntityQuery';


/**
 * @module Selectors
 */
export {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from './EntitySelector';

export {
    default as selectRequestState
} from './RequestStateSelector';


/**
 * @module Actions
 */

export {
    receiveEntity
} from './ReceiveEntityAction';


import {
    ArraySchema,
    EntitySchema
} from './schema/Schema';

export const schema = {
    Array: ArraySchema,
    Entity: EntitySchema
};


//
// Misc

export {
    default as LocalStateHock
} from './LocalStateHock';

export {
    default as connectWithQuery
} from './connectWithQuery';

export {
    default as logRequestActionNames
} from './utils/logRequestActionNames';


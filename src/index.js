// @flow

//
// New API


// Api
export {default as EntityApi} from './EntityApi';


// Schemas
export {default as ArraySchema} from './schema/ListSchema';
export {default as DynamicSchema} from './schema/DynamicSchema';
export {default as EntitySchema} from './schema/EntitySchema';
export {default as ListSchema} from './schema/ListSchema';
export {default as MapSchema} from './schema/MapSchema';
export {default as ObjectSchema} from './schema/MapSchema';
export {default as ValueSchema} from './schema/ValueSchema';

// Selectors
export {
    selectEntityByResult,
    selectEntityById,
    selectEntityByType
} from './EntitySelector';

export {
    default as selectRequestState
} from './RequestStateSelector';

// Misc
export {default as EntityQueryHockFactory} from './EntityQueryHockFactory';
export {default as EntityMutationHockFactory} from './EntityMutationHockFactory';
export {default as EntityReducerFactory} from './EntityReducerFactory';

export {
    EmptyState,
    FetchingState,
    RefetchingState,
    ErrorState,
    SuccessState
} from './RequestState';

export type {RequestState} from './RequestState';

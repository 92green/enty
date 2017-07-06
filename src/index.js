
//
// New API

// Api
export {default as EntityApi} from './EntityApi';

// Schemas
export {default as EntitySchema} from './schema/EntitySchema';
export {default as ArraySchema} from './schema/ArraySchema';
export {default as ObjectSchema} from './schema/ObjectSchema';


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

export {
    FetchingState,
    RefetchingState,
    ErrorState,
    SuccessState
} from './RequestState';




//
// Old API (Bad Terminology)

export {
    createEntityReducer
} from './CreateEntityReducer';



// Deprecated

export {
    default as LocalStateHock
} from './LocalStateHock';

export {
    receiveEntity
} from './ReceiveEntityAction';


// Api
export {default as EntityApi} from './EntityApi';
export {default as RequestState} from './data/RequestState';
export {default as Message} from './data/Message';
export {MessageFactory} from './data/Message';
export {EmptyMessage} from './data/Message';
export {FetchingMessage} from './data/Message';
export {RefetchingMessage} from './data/Message';
export {SuccessMessage} from './data/Message';
export {ErrorMessage} from './data/Message';

// Schemas
export {ArraySchema} from 'enty';
export {EntitySchema} from 'enty';
export {ObjectSchema} from 'enty';

// Singletons
import EntityApi from './EntityApi';
let createRequestHook = null as unknown as ReturnType<typeof EntityApi>['createRequestHook'];
let EntyProvider = null as unknown as ReturnType<typeof EntityApi>['Provider'];

if (createRequestHook === null || EntyProvider === null) {
    const Api = EntityApi({});
    createRequestHook = Api.createRequestHook;
    EntyProvider = Api.Provider;
}

export {createRequestHook, EntyProvider};

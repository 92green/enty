import {Entities, Schema, REMOVED_ENTITIY} from 'enty';
import visitActionMap from './visitActionMap';
import createRequestAction from './createRequestAction';

type RequestState = 'empty' | 'fetching' | 'refetching' | 'success' | 'error';
type AsyncState = 'pending' | 'success' | 'error';

type Options = {
    schema: Schema;
    api: Api;
};

type Requests = {
    [key: string]: {
        state: RequestState;
        result: any;
    };
};
type Api = {[key: string]: Object};

export default class EntityStore {
    _callback: Array<Function>;
    _responseCount: number;
    _entity: Entities;
    _request: Requests;
    _api: Api;
    _rootSchema: Schema;
    _schema: {[key: string]: Schema};

    constructor(options: Options) {
        this._entity = {};
        this._request = {};
        this._responseCount = 0;
        this._rootSchema = options.schema;
        this._api = visitActionMap(options.api, createRequestAction);
    }

    //
    // Private Methods

    _normalizePayload(payload: Object) {
        const {entities, result, schemas} = this._rootSchema.normalize(payload, this._entity);
        this._entity = entities;
        this._schema = schemas;
        return result;
    }
    _notifiy() {
        this._callback.forEach((fn) => fn());
    }

    //
    // Public Methods

    update(payload: Object) {
        this._normalizePayload(payload);
        this._notifiy();
    }

    updateRequest(key: string, type: AsyncState, payload: Object) {
        const {result} = this._request[key];
        switch (type) {
            case 'pending':
                this._request[key].state = result ? 'refetching' : 'fetching';
                break;

            case 'success':
            case 'error':
                this._request[key] = {
                    state: type,
                    result: this._normalizePayload(payload)
                };
                break;
        }
        this._notifiy();
    }

    removeEntity(type: string, id: string) {
        this._entity[type][id] = REMOVED_ENTITIY;
        this._notifiy();
    }

    removeRequest(key: string) {
        delete this._request[key].result;
        this._notifiy();
    }

    getEntity(type: string, id: string) {
        return this._schema[type]?.denormalize(this._entity[type]?.[id]);
    }

    getRequest(responseKey: string) {
        const {state, result} = this._request[responseKey];
        return {
            state: state || 'empty',
            result
        };
    }

    subscribe(callback: Function) {
        this._callback.push(callback);
    }

    get api() {
        return this._api;
    }
}

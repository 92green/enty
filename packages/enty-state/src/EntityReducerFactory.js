//@flow
import type {Schema} from 'enty/lib/util/definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import merge from 'unmutable/lib/merge';
import pipeWith from 'unmutable/lib/util/pipeWith';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import updateIn from 'unmutable/lib/updateIn';
import REMOVED_ENTITY from 'enty/lib/util/RemovedEntity';

import RequestState from './data/RequestState';
import Logger from './util/Logger';

type State = {
    baseSchema: Schema,
    schemas: {[key: string]: Schema},
    response: {[key: string]: *},
    error: {[key: string]: *},
    requestState: {[key: string]: *},
    entities: {[key: string]: *},
    stats: {
        responseCount: number
    }
};

export default function EntityReducerFactory(config: {schema?: Schema}): Function {
    const {schema} = config;

    return function EntityReducer(previousState: State, {type, payload, meta = {}}: Object): State {

        Logger.info(`\n\nEntity reducer:`);

        let state = previousState || {
            baseSchema: schema,
            schemas: {},
            response: {},
            error: {},
            requestState: {},
            entities: {},
            stats: {
                responseCount: 0
            }
        };

        const {responseKey} = meta;
        const requestStatePath = ['requestState', responseKey];
        const responsePath = ['response', responseKey];
        const errorPath = ['error', responseKey];
        const incrementResponseCount = updateIn(['stats', 'responseCount'], count => count + 1);


        Logger.info(`Attempting to reduce with type "${type}"`);


        switch (type) {
            case 'ENTY_FETCH':
                if(getIn(requestStatePath)(state)) {
                    Logger.info(`Setting RequestState.refetching for "${requestStatePath.join('.')}"`);
                    state = setIn(requestStatePath, RequestState.refetching())(state);
                } else {
                    state = setIn(requestStatePath, RequestState.fetching())(state);
                    Logger.info(`Setting RequestState.fetching for "${requestStatePath.join('.')}"`, state);
                }
                return state;

            case 'ENTY_ERROR':
                Logger.info(`Setting ErrorState for "${requestStatePath.join('.')}"`);
                return pipeWith(
                    state,
                    setIn(requestStatePath, RequestState.error(payload)),
                    setIn(errorPath, payload)
                );

            case 'ENTY_RECEIVE':
                Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

                // set success action before payload tests
                // to make sure the request state is still updated even if there is no payload
                state = setIn(requestStatePath, RequestState.success())(state);

                if(payload) {
                    if(schema) {
                        const {result, entities, schemas} = schema.normalize(
                            payload,
                            pipeWith(state, get('entities'), clone())
                        );

                        Logger.infoIf(entities.size == 0, `0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                        Logger.info(`Merging any normalized entities and response into state`);


                        return pipeWith(
                            state,
                            set('entities', entities),
                            setIn(responsePath, result),
                            updateIn(['schemas'], merge(schemas)),
                            incrementResponseCount,
                            state => Logger.silly('state', state) || state
                        );
                    } else {
                        Logger.info(`No schema, merging response without normalizing`);
                        return pipeWith(
                            state,
                            setIn(responsePath, payload),
                            incrementResponseCount
                        );
                    }
                }
                return state;

            case 'ENTY_REMOVE':
                return pipeWith(
                    state,
                    incrementResponseCount,
                    setIn(['entities', ...payload], REMOVED_ENTITY)
                );

            default:
                return state;
        }
    };
}

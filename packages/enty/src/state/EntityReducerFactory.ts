import {Schema} from '../util/definitions';
import {State, Action} from './definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import merge from 'unmutable/lib/merge';
import pipeWith from 'unmutable/lib/util/pipeWith';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import hasIn from 'unmutable/lib/hasIn';
import updateIn from 'unmutable/lib/updateIn';
import deleteIn from 'unmutable/lib/deleteIn';
import REMOVED_ENTITY from '../util/RemovedEntity';

import RequestState from './RequestState';

export default function EntityReducerFactory(config: {schema?: Schema}): Function {
    const {schema} = config;

    return function EntityReducer(previousState: State, {type, payload, meta}: Action): State {
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
        const incrementResponseCount = updateIn(['stats', 'responseCount'], (count) => count + 1);

        switch (type) {
            case 'ENTY_FETCH': {
                let requestState = getIn(requestStatePath)(state);
                let hasResponse = hasIn(responsePath)(state);
                if (requestState && hasResponse) {
                    state = setIn(requestStatePath, RequestState.refetching())(state);
                } else {
                    state = setIn(requestStatePath, RequestState.fetching())(state);
                }
                return state;
            }

            case 'ENTY_ERROR':
                return pipeWith(
                    state,
                    setIn(requestStatePath, RequestState.error(payload)),
                    setIn(errorPath, payload)
                );

            case 'ENTY_RECEIVE':
                // set success action before payload tests
                // to make sure the request state is still updated even if there is no payload
                state = setIn(requestStatePath, RequestState.success())(state);

                if (payload) {
                    if (schema) {
                        const {
                            output: result,
                            state: entities,
                            schemasUsed: schemas
                        } = schema.normalize({
                            input: payload,
                            state: pipeWith(state, get('entities'), clone()),
                            meta: {}
                        });

                        return pipeWith(
                            state,
                            set('entities', entities),
                            setIn(responsePath, result),
                            updateIn(['schemas'], merge(schemas)),
                            incrementResponseCount
                        );
                    } else {
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

            case 'ENTY_RESET':
                return pipeWith(
                    state,
                    incrementResponseCount,
                    setIn(requestStatePath, RequestState.empty()),
                    deleteIn(responsePath)
                );

            default:
                return state;
        }
    };
}

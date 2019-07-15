//@flow
import type {Schema} from 'enty/lib/util/definitions';
import type {Structure} from 'enty/lib/util/definitions';

import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import getIn from 'unmutable/lib/getIn';
import merge from 'unmutable/lib/merge';
import pipeWith from 'unmutable/lib/util/pipeWith';
import set from 'unmutable/lib/set';
import setIn from 'unmutable/lib/setIn';
import updateIn from 'unmutable/lib/updateIn';

import {FetchingState} from './data/RequestState';
import {RefetchingState} from './data/RequestState';
import {ErrorState} from './data/RequestState';
import {SuccessState} from './data/RequestState';
import Logger from './util/Logger';

type State = {
    _baseSchema: Schema<Structure>,
    _schemas: {[key: string]: Schema<any>},
    _result: {[key: string]: *},
    _error: {[key: string]: *},
    _requestState: {[key: string]: *},
    _entities: {[key: string]: *},
    _stats: {
        normalizeCount: number
    }
};

export default function EntityReducerFactory(config: {schema?: Schema<Structure>}): Function {
    const {schema} = config;

    return function EntityReducer(previousState: State, {type, payload, meta = {}}: Object): State {

        Logger.info(`\n\nEntity reducer:`);

        let state = previousState || {
            _baseSchema: schema,
            _schemas: {},
            _result: {},
            _error: {},
            _requestState: {},
            _entities: {},
            _stats: {
                normalizeCount: 0
            }
        };

        const {resultKey} = meta;
        const requestStatePath = ['_requestState', resultKey];
        const resultPath = ['_result', resultKey];
        const errorPath = ['_error', resultKey];


        Logger.info(`Attempting to reduce with type "${type}"`);


        //
        // Set Request States for BLANK/FETCH/ERROR
        if(/_FETCH$/g.test(type)) {
            if(getIn(requestStatePath)(state)) {
                Logger.info(`Setting RefetchingState for "${requestStatePath.join('.')}"`);
                state = setIn(requestStatePath, RefetchingState())(state);
            } else {
                state = setIn(requestStatePath, FetchingState())(state);
                Logger.info(`Setting FetchingState for "${requestStatePath.join('.')}"`, state);
            }
        } else if(/_ERROR$/g.test(type)) {
            Logger.info(`Setting ErrorState for "${requestStatePath.join('.')}"`);
            state = pipeWith(
                state,
                setIn(requestStatePath, ErrorState(payload)),
                setIn(errorPath, payload)
            );
        }



        if(/_RECEIVE$/g.test(type)) {
            Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

            // set success action before payload tests
            // to make sure the request state is still updated even if there is no payload
            state = setIn(requestStatePath, SuccessState())(state);

            if(payload) {
                if(schema) {
                    const {result, entities, schemas} = schema.normalize(
                        payload,
                        pipeWith(state, get('_entities'), clone())
                    );

                    Logger.infoIf(entities.size == 0, `0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                    Logger.info(`Merging any normalized entities and result into state`);


                    return pipeWith(
                        state,
                        set('_entities', entities),
                        setIn(resultPath, result),
                        updateIn(['_schemas'], merge(schemas)),
                        updateIn(['_stats', 'normalizeCount'], count => count + 1),
                        state => Logger.silly('state', state) || state
                    );
                } else {
                    Logger.info(`No schema, merging result without normalizing`);
                    return pipeWith(
                        state,
                        setIn(resultPath, payload),
                        updateIn(['_stats', 'normalizeCount'], count => count + 1),
                    );
                }
            }


        }

        Logger.info(`Type is not *_RECEIVE, no entity data has been changed`, state);
        return state;
    };
}

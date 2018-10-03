//@flow
import type {Schema} from 'enty/lib/util/definitions';
import type {Structure} from 'enty/lib/util/definitions';

import {Map} from 'immutable';
import updateIn from 'unmutable/lib/updateIn';
import setIn from 'unmutable/lib/setIn';
import getIn from 'unmutable/lib/getIn';
import deleteIn from 'unmutable/lib/deleteIn';
import set from 'unmutable/lib/set';
import clone from 'unmutable/lib/clone';
import get from 'unmutable/lib/get';
import merge from 'unmutable/lib/merge';
import pipeWith from 'unmutable/lib/util/pipeWith';

import {FetchingState} from './RequestState';
import {RefetchingState} from './RequestState';
import {ErrorState} from './RequestState';
import {SuccessState} from './RequestState';
import Logger from './Logger';


export default function EntityReducerFactory(config: {schema: Schema<Structure>}): Function {
    const {schema} = config;

    const defaultMeta = {
        resultResetOnFetch: false
    };

    return function EntityReducer(previousState: *, {type, payload, meta}: Object): Map<any, any> {

        Logger.info(`\n\nEntity reducer:`);

        let state = previousState || Map({
            _baseSchema: schema,
            _schemas: {},
            _result: {},
            _error: {},
            _requestState: {},
            _entities: {},
            _stats: Map({
                normalizeCount: 0
            })
        });


        const {
            resultKey = type,
            resultResetOnFetch
        } = Object.assign({}, defaultMeta, meta);


        // @FIXME: resultKey should be defined before the reducer.
        // The reducer should not have to infer any data.
        var [, actionTypePrefix] = resultKey.toString().match(/(.*)_(FETCH|ERROR|RECEIVE)$/) || [];
        const requestStatePath = ['_requestState', actionTypePrefix || resultKey];
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



        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            Logger.info(`Type is *_FETCH and resultResetOnFetch is true, returning state with deleted _result key`);
            return deleteIn(['_result', resultKey])(state);
        }


        if(/_RECEIVE$/g.test(type)) {
            Logger.info(`Type is *_RECEIVE, will attempt to receive data. Payload:`, payload);

            // set success action before payload tests
            // to make sure the request state is still updated even if there is no payload
            state = setIn(requestStatePath, SuccessState())(state);

            if(schema && payload) {
                const {result, entities, schemas} = schema.normalize(
                    payload,
                    pipeWith(state, get('_entities'), clone())
                );

                Logger.infoIf(entities.size == 0, `0 entities have been normalised with your current schema. This is the schema being used:`, schema);
                Logger.info(`Merging any normalized entities and result into state`);


                return pipeWith(
                    state,
                    set('_entities', entities),
                    setIn(['_result', resultKey], result),
                    updateIn(['_schemas'], merge(schemas)),
                    updateIn(['_stats', 'normalizeCount'], count => count + 1),
                    state => Logger.silly('state', state) || state
                );
            }


            Logger.infoIf(!schema, `Schema is not defined, no entity data has been changed`, state);
            Logger.infoIf(!payload, `Payload is not defined, no entity data has been changed`, state);
        }

        Logger.info(`Type is not *_RECEIVE, no entity data has been changed`, state);
        return state;
    };
}

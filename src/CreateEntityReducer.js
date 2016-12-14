import {fromJS, Map, List, Iterable} from 'immutable';
import {normalize} from 'normalizr';
import DetermineReviverType from './utils/DetermineReviverType';
import MergeEntities from './utils/MergeEntities';

function defaultConstructor(value) {
    return value;
}

/**
 * Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
 * Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called `mainSchema` returns a reducer that holds the main entity state.
 * ```js
 * import {createEntityReducer} from 'redux-blueflag';
 * import EntitySchema from 'myapp/EntitySchema';
 *
 * export default combineReducers({
 *     entity: createEntityReducer({
 *          schemaMap: {
 *              GRAPHQL_RECEIVE: EntitySchema,
 *              MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSchema
 *          },
 *          beforeNormalize: (value, key) => value,
 *          afterNormalize: (value, key) => value,
 *     })
 * });
 * ```
 * @exports createEntityReducer
 * @param {object} schemaMap - Map of schema action names.
 * @param {function} config.beforeNormalize - config.beforeNormalize function to edit payload data before it is normalized.
 * @param {function} config.afterNormalize - config.afterNormalize function to edit payload data after it is normalized.
 */
export function createEntityReducer(config) {

    const {
        schemaMap,
        beforeNormalize = defaultConstructor,
        afterNormalize = defaultConstructor
    } = config;

    const initialState = Map({
        _schema: Map(schemaMap),
        _result: Map(),
        _requestState: Map(),
    })

    const defaultMeta = {
        resultResetOnFetch: true
    }

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta}) {
        const {
            schema = schemaMap[type],
            resultKey = type,
            resultResetOnFetch,
        } = Object.assign({}, defaultMeta, meta);

        var [, actionTypePrefix] = resultKey.toString().match(/(.*)_(FETCH|ERROR|RECEIVE)$/) || [];

        //
        // ENTITY_DELETE takes a keypath as its payload
        // and sets a flag of `__deleted` on the entity
        //
        if(type === 'ENTITY_DELETE') {
            let entityPath = List(payload).take(2);
            if(state.getIn(entityPath)) {
                return state.setIn(entityPath.concat('__deleted'), true);
            }
        }

        state = state.setIn(['_requestState', actionTypePrefix || resultKey], Map({
            fetch : /_FETCH$/g.test(type),
            error : /_ERROR$/g.test(type) ? payload : null
        }));

        // If the action is a FETCH and the user hasn't negated the resultResetOnFetch
        if(resultResetOnFetch && /_FETCH$/g.test(type)) {
            return state.deleteIn(['_result', resultKey]);
        }


        if(schema && payload && /_RECEIVE$/g.test(type)) {
            // revive data from raw payload
            const reducedData = fromJS(payload, DetermineReviverType(beforeNormalize, schema._key)).toJS();
            // normalize using proved schema
            const {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

            return state
                // set results
                .setIn(['_result', resultKey], result)
                .update(MergeEntities(entities, afterNormalize));

        }

        return state;
    }
}

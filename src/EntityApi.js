//@flow
import {createAction} from 'redux-actions';
import EntityQueryHockFactory from './EntityQueryHockFactory';
import EntityMutationHockFactory from './EntityMutationHockFactory';
import EntityReducerFactory from './EntityReducerFactory';
import EntityStoreFactory from './EntityStoreFactory';
import {fromJS, Map} from 'immutable';

/**
 * The Entity Api is the main access point for your data. It allows you to define the link between your views
 * and the services that they fetch their data from.
 * Its main purpose it to:
 *
 * 1. Construct a redux store from your schema.
 * 2. Create higher order components that connect data to your views.
 *
 * @module Api
 */


// Turns a nested object into a flat
// UPPER_SNAKE case representation
function reduceActionMap(branch: Map, parentKey: string = ''): Map {
    return branch.reduce((rr: Map, ii: any, key: string): Map => {
        var prefix = `${parentKey}${key.toUpperCase()}`;
        if(Map.isMap(ii)) {
            return rr.merge(reduceActionMap(ii, `${prefix}_`));
        } else {
            return rr.set(prefix, ii);
        }
    }, Map());
}

// @param {string} fetchAction     action name for fetching action
// @param {string} recieveAction   action name for receiving action
// @param {string} errorAction     action name for error action
// @param {function} sideEffect    Promise returning side effect to call after fetch action.
// @return {array}            list of action creators and action types
// @memberof module:Api
function createRequestAction(fetchAction: string, recieveAction: string, errorAction: string, sideEffect: Function): Function {
    function action(aa: string): Function {
        return createAction(aa, (payload) => payload, (payload, meta) => meta);
    }
    return (requestPayload, meta = {}) => (dispatch: Function, getState: Function): Promise<*> => {
        var sideEffectMeta = {
            ...meta,
            dispatch,
            getState
        };

        var actionMeta = (resultKey) => ({
            ...meta,
            resultKey: meta.resultKey || resultKey
        });

        dispatch(action(fetchAction)(null, {resultKey: meta.resultKey || fetchAction}));
        return sideEffect(requestPayload, sideEffectMeta).then(
            (data: any): Promise<any> => {
                return dispatch(action(recieveAction)(data, actionMeta(recieveAction)));
            },
            (error: any): Promise<any> => {
                return dispatch(action(errorAction)(error, {resultKey: meta.resultKey || errorAction}));
            }
        );
    };
}


/**
 * Constructs an Entity Api based off a schema and an object of promise returning functions.
 *
 * EntityApi will construct QueryHocks and MutationHocks for each promise returning function,
 * and a Redux store and reducer for your entity state.
 *
 *
 * @example
 * import {EntityApi} from 'enty';
 * import ApplicationSchema from './entity/ApplicationSchema';
 *
 * const Api = EntityApi(ApplicationSchema, {
 *     core: payload => post('/graphql', payload),
 *     user: payload => post('/user', payload),
 *     article: {
 *         create: payload => post('/article', payload),
 *         list: payload => get('/article', payload)
 *     }
 * });
 *
 * export const {
 *     EntityStore,
 *
 *     CoreQueryHock,
 *     CoreMutationHock,
 *     UserQueryHock,
 *     UserMutationHock,
 *     ArticleCreateQueryHock,
 *     ArticleCreateMutationHock,
 *     ArticleListQueryHock,
 *     ArticleListMutationHock
 * } = Api;
 *
 * @param  {Schema} schema          A schema describing the relationships between your data
 * @param  {object} actionMap       deep object representation of api functions
 * @param  {SelectOptions} [selectOptions]
 * @return {EntityApi}
 * @memberof module:Api
 */
export default function EntityApi(schema: Object, actionMap: Object, selectOptions: SelectOptions = {}): Object {
    return reduceActionMap(fromJS(actionMap))
        .reduce((state: Map, sideEffect: Function, action: string): Map => {

            const FETCH = `${action}_FETCH`;
            const RECEIVE = `${action}_RECEIVE`;
            const ERROR = `${action}_ERROR`;

            const requestAction = createRequestAction(FETCH, RECEIVE, ERROR, sideEffect);
            const requestActionPath = action.split('_').map(ii => ii.toLowerCase());
            const requestActionName = action
                .split('_')
                .map(ss => ss.toLowerCase().replace(/^./, mm => mm.toUpperCase()))
                .join('');

            return state
                // nested action creators
                .setIn(requestActionPath, requestAction)

                // root api
                .setIn(['actionTypes', FETCH], FETCH)
                .setIn(['actionTypes', RECEIVE], RECEIVE)
                .setIn(['actionTypes', ERROR], ERROR)
                .set(`${requestActionName}QueryHock`, EntityQueryHockFactory(requestAction, selectOptions))
                .set(`${requestActionName}MutationHock`, EntityMutationHockFactory(requestAction, selectOptions))
            ;

        }, Map())
        .update((api: Map): Map => {
            // convert receive actions to a standard that EntityReducerFactory can understand
            // {
            //     ACTION_RECIEVE: schema
            //     ...
            // }
            const actionMap = api
                .get('actionTypes')
                .filter((action, key) => /_RECEIVE$/g.test(key))
                .reduce((actionMap, key) => actionMap.set(key, schema), Map())
                .set(selectOptions.schemaKey || 'ENTITY_RECEIVE', schema)
                .toObject()
            ;

            const reducer = EntityReducerFactory({schemaMap: actionMap});

            return api
                .set('EntityReducer', reducer)
                .set('EntityStore', EntityStoreFactory(reducer));
        })
        .toJS();
}



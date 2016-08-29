import {createAction} from 'redux-actions';
import {fromJS, Map} from 'immutable';

export function LogRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(CreateRequestActionSet(actionMap, prefix)).join('\n'));
}

export function CreateRequestActionSet(actionMap) {

    //
    // Turns a nested object into a flat 
    // UPPER_SNAKE case represention
    function reduceActionMap(branch, parentKey = '') {
        return branch.reduce((rr, ii, key) => {
            var prefix = `${parentKey}${key.toUpperCase()}`;
            if(Map.isMap(ii)) {
                return rr.merge(reduceActionMap(ii, `${prefix}_`));
            } else {
                return rr.set(prefix, ii);
            }
        }, Map())
    }


    return reduceActionMap(fromJS(actionMap))
        .map((sideEffect, action) => {
            const FETCH = `${action}_FETCH`;
            const RECIEVE = `${action}_RECIEVE`;
            const ERROR = `${action}_ERROR`;

            const requestActionName = action
                .split('_')
                .map(ss => ss.toLowerCase().replace(/^./, mm => mm.toUpperCase()))
                .join('');

            return Map()
                .set(`request${requestActionName}`, CreateRequestAction(FETCH, RECIEVE, ERROR, sideEffect))
                .set(FETCH, FETCH)
                .set(RECIEVE, RECIEVE)
                .set(ERROR, ERROR);
                
        })
        .flatten(1)
        .toJS();
}

export default function CreateRequestAction(fetchAction, recieveAction, errorAction, sideEffect) {
    return (...args) => (dispatch) => {
        dispatch(createAction(fetchAction)());
        return sideEffect(...args).then(
            (data) => {
                return Promise.resolve(dispatch(createAction(recieveAction)(data)))
            },
            (error) => {
                return dispatch(createAction(errorAction)(error));
            }
        )
    }
}

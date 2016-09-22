'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.logRequestActionNames = logRequestActionNames;
exports.createRequestActionSet = createRequestActionSet;
exports.default = createRequestAction;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

/**
 * Given the return value of creatRequestActionSet it will log the names of the created action types and creators
 * @param  {object} actionMap map of actions
 * @param  {string} prefix    String to prefix actions types with
 */
function logRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(createRequestActionSet(actionMap, prefix)).join('\n'));
}

/**
 * returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.
 * dispatch `fetchAction`
 * call `sideEffect`
 * then dispatch `recieveAction`
 * catch dispatch `errorAction`
 *
 * @param  {object} actionMap deep object representation of api functions
 * @return {array}            list of action creators and action types
 */
function createRequestActionSet(actionMap) {

    //
    // Turns a nested object into a flat
    // UPPER_SNAKE case represention
    function reduceActionMap(branch) {
        var parentKey = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

        return branch.reduce(function (rr, ii, key) {
            var prefix = '' + parentKey + key.toUpperCase();
            if (_immutable.Map.isMap(ii)) {
                return rr.merge(reduceActionMap(ii, prefix + '_'));
            } else {
                return rr.set(prefix, ii);
            }
        }, (0, _immutable.Map)());
    }

    return reduceActionMap((0, _immutable.fromJS)(actionMap)).map(function (sideEffect, action) {
        var FETCH = action + '_FETCH';
        var RECIEVE = action + '_RECEIVE';
        var ERROR = action + '_ERROR';

        var requestActionName = action.split('_').map(function (ss) {
            return ss.toLowerCase().replace(/^./, function (mm) {
                return mm.toUpperCase();
            });
        }).join('');

        return (0, _immutable.Map)().set('request' + requestActionName, createRequestAction(FETCH, RECIEVE, ERROR, sideEffect)).set(FETCH, FETCH).set(RECIEVE, RECIEVE).set(ERROR, ERROR);
    }).flatten(1).toJS();
}

function createRequestAction(fetchAction, recieveAction, errorAction, sideEffect) {
    function action(aa) {
        return (0, _reduxActions.createAction)(aa, function (payload) {
            return payload;
        }, function (payload, meta) {
            return meta;
        });
    }
    return function (requestPayload) {
        var meta = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        return function (dispatch, getState) {
            var sideEffectMeta = _extends({}, meta, {
                dispatch: dispatch,
                getState: getState
            });

            var actionMeta = function actionMeta(resultKey) {
                return _extends({}, meta, {
                    resultKey: meta.resultKey || resultKey
                });
            };

            dispatch(action(fetchAction)(null, { resultKey: meta.resultKey || fetchAction }));
            return sideEffect(requestPayload, sideEffectMeta).then(function (data) {
                return Promise.resolve(dispatch(action(recieveAction)(data, actionMeta(recieveAction))));
            }, function (error) {
                return dispatch((0, _reduxActions.createAction)(errorAction)(error, { resultKey: meta.resultKey || errorAction }));
            });
        };
    };
}
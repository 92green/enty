'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logRequestActionNames = logRequestActionNames;
exports.createRequestActionSet = createRequestActionSet;
exports.default = createRequestAction;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

function logRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(createRequestActionSet(actionMap, prefix)).join('\n'));
}

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
    return function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return function (dispatch) {
            dispatch(action(fetchAction)(null, { resultKey: fetchAction }));
            return sideEffect.apply(undefined, args).then(function (data) {
                return Promise.resolve(dispatch(action(recieveAction)(data, { resultKey: recieveAction })));
            }, function (error) {
                return dispatch((0, _reduxActions.createAction)(errorAction)(error, { resultKey: errorAction }));
            });
        };
    };
}
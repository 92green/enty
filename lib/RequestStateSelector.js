'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.selectRequestState = selectRequestState;

var _immutable = require('immutable');

function selectRequestState(state, actions) {
    // use custom request state if not provided
    var requestState = state.requestState || (0, _immutable.Map)(state);

    switch (typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) {
        case 'string':
            return requestState
            // filter out provided single actions from requestState
            .filter(function (ii, key) {
                return key.indexOf(actions) > -1;
            })
            // reduce to just fetch,error,receive
            .reduce(function (rr, ii, kk) {
                return rr.set((0, _immutable.List)(kk.split('_')).last().toLowerCase(), ii);
            }, (0, _immutable.Map)());

        default:
            return requestState
            // filter out provided list of actions from requestState
            .filter(function (ii, key) {
                return actions.filter(function (action) {
                    return key.indexOf(action) > -1;
                }).length > 0;
            })
            // reduce to camelCase version of action names
            .reduce(function (rr, ii, kk) {
                var keyPath = key.split('_')
                // TitleCase
                .map(function (ss) {
                    return ss.toLowerCase().replace(/^./, function (ii) {
                        return ii.toUpperCase();
                    });
                }).join('')
                // lowerCase first makes camelCase
                .replace(/^./, function (ii) {
                    return ii.toLowerCase();
                });

                return rr.set(keyPath, value);
            }, (0, _immutable.Map)());
    }
}
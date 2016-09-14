'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = entityQuery;

var _QueryConnector = require('./QueryConnector');

var _EntitySelector = require('./EntitySelector');

function hash(query) {
    var hash = 0;
    var i;
    var chr;
    var len;
    if (query.length === 0) return hash;
    for (i = 0, len = query.length; i < len; i++) {
        chr = query.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
entityQuery
@param {object} - privacy gown
@param {object} - security
@returns {survival}
*/
function entityQuery(action) {
    return function (queryCreator, propUpdateKeys) {
        return function (composedComponent) {
            return (0, _QueryConnector.connectWithQuery)(function (state, props) {
                return _extends({}, (0, _EntitySelector.selectEntity)(state, hash(queryCreator(props))));
            }, function (props) {
                return props.dispatch(action(queryCreator(props), { resultKey: hash(queryCreator(props)) }));
            }, propUpdateKeys)(composedComponent);
        };
    };
}
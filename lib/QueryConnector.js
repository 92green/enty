'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectWithQuery = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _immutable = require('immutable');

var _PropChangeHock = require('./PropChangeHock');

var _PropChangeHock2 = _interopRequireDefault(_PropChangeHock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var connectWithQuery = exports.connectWithQuery = function connectWithQuery(connector, query, propChangeList) {
    return function (ComposedComponent) {

        var reduxConnect = (0, _reactRedux.connect)(connector);
        var propChangeListener = (0, _PropChangeHock2.default)(propChangeList, query);

        return reduxConnect(propChangeListener(ComposedComponent));
    };
};
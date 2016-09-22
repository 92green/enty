'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * `LocalStateHock(reducer: function(state, action)) => function(component: Component)`
Wraps a component with a tiny implementation of the redux concept. Takes a reducer and returns a function ready to call with a component. The hock gives the component `props.localDispatch`which triggers the reducer. the return state of the reducer is then destructured on to the components as props.
 * @exports LocalStateHock
 * @param  {function}   reducer             a function that acts as a local reducer
 * @return {function}   componentCreator    function to pass react component
 */
exports.default = function (reducer) {
    return function (ComposedComponent) {
        return function (_Component) {
            _inherits(LocalStateHock, _Component);

            function LocalStateHock(props) {
                _classCallCheck(this, LocalStateHock);

                var _this = _possibleConstructorReturn(this, (LocalStateHock.__proto__ || Object.getPrototypeOf(LocalStateHock)).call(this, props));

                _this.state = reducer(undefined, {});
                _this.dispatch = _this.dispatch.bind(_this);
                return _this;
            }

            _createClass(LocalStateHock, [{
                key: 'dispatch',
                value: function dispatch(action) {
                    this.setState(function (prevState) {
                        return reducer(prevState, action);
                    });
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, this.state, { localDispatch: this.dispatch }));
                }
            }]);

            return LocalStateHock;
        }(_react.Component);
    };
};
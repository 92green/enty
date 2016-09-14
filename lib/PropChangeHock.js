'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react2 = require('react');

var _react3 = _interopRequireDefault(_react2);

var _reactTransformHmr3 = require('react-transform-hmr');

var _reactTransformHmr4 = _interopRequireDefault(_reactTransformHmr3);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _components = {
    AutoRequest: {
        displayName: 'AutoRequest',
        isInFunction: true
    }
};

var _reactTransformHmr2 = (0, _reactTransformHmr4.default)({
    filename: 'src/PropChangeHock.jsx',
    components: _components,
    locals: [module],
    imports: [_react3.default]
});

function _wrapComponent(id) {
    return function (Component) {
        return _reactTransformHmr2(Component, id);
    };
}

exports.default = function () {
    var propKeys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var outputFunction = arguments[1];
    return function (ComposedComponent) {
        return _wrapComponent('AutoRequest')(function (_Component) {
            _inherits(AutoRequest, _Component);

            function AutoRequest(props, context) {
                _classCallCheck(this, AutoRequest);

                return _possibleConstructorReturn(this, (AutoRequest.__proto__ || Object.getPrototypeOf(AutoRequest)).call(this, props, context));
            }

            _createClass(AutoRequest, [{
                key: 'componentWillMount',
                value: function componentWillMount() {
                    outputFunction(this.props);
                }
            }, {
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    // make props immutable Maps
                    var thisPropsImmutable = (0, _immutable.fromJS)(this.props);
                    var nextPropsImmutable = (0, _immutable.fromJS)(nextProps);

                    var booleanTest = propKeys.map(function (ii) {
                        var keyPath = ii.split('.');
                        return thisPropsImmutable.getIn(keyPath) !== nextPropsImmutable.getIn(keyPath);
                    }).indexOf(true);

                    if (booleanTest !== -1) {
                        outputFunction(nextProps);
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react3.default.createElement(ComposedComponent, this.props);
                }
            }]);

            return AutoRequest;
        }(_react2.Component));
    };
};
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhbFN0YXRlSG9jay5qc3giXSwibmFtZXMiOlsicmVkdWNlciIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVuZGVmaW5lZCIsImRpc3BhdGNoIiwiYmluZCIsImFjdGlvbiIsInNldFN0YXRlIiwicHJldlN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7O2tCQU9lLFVBQUNBLE9BQUQ7QUFBQSxXQUFhLFVBQUNDLGlCQUFELEVBQXVCO0FBQy9DO0FBQUE7O0FBQ0ksb0NBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SUFDVEEsS0FEUzs7QUFFZixzQkFBS0MsS0FBTCxHQUFhSCxRQUFRSSxTQUFSLEVBQW1CLEVBQW5CLENBQWI7QUFDQSxzQkFBS0MsUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNDLElBQWQsT0FBaEI7QUFIZTtBQUlsQjs7QUFMTDtBQUFBO0FBQUEseUNBTWFDLE1BTmIsRUFNcUI7QUFDYix5QkFBS0MsUUFBTCxDQUFjO0FBQUEsK0JBQWFSLFFBQVFTLFNBQVIsRUFBbUJGLE1BQW5CLENBQWI7QUFBQSxxQkFBZDtBQUNIO0FBUkw7QUFBQTtBQUFBLHlDQVNhO0FBQ0wsMkJBQU8sOEJBQUMsaUJBQUQsZUFBdUIsS0FBS0wsS0FBNUIsRUFBdUMsS0FBS0MsS0FBNUMsSUFBbUQsZUFBZSxLQUFLRSxRQUF2RSxJQUFQO0FBQ0g7QUFYTDs7QUFBQTtBQUFBO0FBYUgsS0FkYztBQUFBLEMiLCJmaWxlIjoiTG9jYWxTdGF0ZUhvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnO1xuXG4vKipcbiAqIGBMb2NhbFN0YXRlSG9jayhyZWR1Y2VyOiBmdW5jdGlvbihzdGF0ZSwgYWN0aW9uKSkgPT4gZnVuY3Rpb24oY29tcG9uZW50OiBDb21wb25lbnQpYFxuV3JhcHMgYSBjb21wb25lbnQgd2l0aCBhIHRpbnkgaW1wbGVtZW50YXRpb24gb2YgdGhlIHJlZHV4IGNvbmNlcHQuIFRha2VzIGEgcmVkdWNlciBhbmQgcmV0dXJucyBhIGZ1bmN0aW9uIHJlYWR5IHRvIGNhbGwgd2l0aCBhIGNvbXBvbmVudC4gVGhlIGhvY2sgZ2l2ZXMgdGhlIGNvbXBvbmVudCBgcHJvcHMubG9jYWxEaXNwYXRjaGB3aGljaCB0cmlnZ2VycyB0aGUgcmVkdWNlci4gdGhlIHJldHVybiBzdGF0ZSBvZiB0aGUgcmVkdWNlciBpcyB0aGVuIGRlc3RydWN0dXJlZCBvbiB0byB0aGUgY29tcG9uZW50cyBhcyBwcm9wcy5cbiAqIEBleHBvcnRzIExvY2FsU3RhdGVIb2NrXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICByZWR1Y2VyICAgICAgICAgICAgIGEgZnVuY3Rpb24gdGhhdCBhY3RzIGFzIGEgbG9jYWwgcmVkdWNlclxuICogQHJldHVybiB7ZnVuY3Rpb259ICAgY29tcG9uZW50Q3JlYXRvciAgICBmdW5jdGlvbiB0byBwYXNzIHJlYWN0IGNvbXBvbmVudFxuICovXG5leHBvcnQgZGVmYXVsdCAocmVkdWNlcikgPT4gKENvbXBvc2VkQ29tcG9uZW50KSA9PiB7XG4gICAgcmV0dXJuIGNsYXNzIExvY2FsU3RhdGVIb2NrIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICAgICAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICAgICAgICAgIHN1cGVyKHByb3BzKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSByZWR1Y2VyKHVuZGVmaW5lZCwge30pO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaCA9IHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHJlZHVjZXIocHJldlN0YXRlLCBhY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPENvbXBvc2VkQ29tcG9uZW50IHsuLi50aGlzLnByb3BzfSB7Li4udGhpcy5zdGF0ZX0gbG9jYWxEaXNwYXRjaD17dGhpcy5kaXNwYXRjaH0gLz47XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
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

                _this.state = reducer(undefined, undefined);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhbFN0YXRlSG9jay5qc3giXSwibmFtZXMiOlsicmVkdWNlciIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVuZGVmaW5lZCIsImRpc3BhdGNoIiwiYmluZCIsImFjdGlvbiIsInNldFN0YXRlIiwicHJldlN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7O2tCQU9lLFVBQUNBLE9BQUQ7QUFBQSxXQUFhLFVBQUNDLGlCQUFELEVBQXVCO0FBQy9DO0FBQUE7O0FBQ0ksb0NBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SUFDVEEsS0FEUzs7QUFFZixzQkFBS0MsS0FBTCxHQUFhSCxRQUFRSSxTQUFSLEVBQW1CQSxTQUFuQixDQUFiO0FBQ0Esc0JBQUtDLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjQyxJQUFkLE9BQWhCO0FBSGU7QUFJbEI7O0FBTEw7QUFBQTtBQUFBLHlDQU1hQyxNQU5iLEVBTXFCO0FBQ2IseUJBQUtDLFFBQUwsQ0FBYztBQUFBLCtCQUFhUixRQUFRUyxTQUFSLEVBQW1CRixNQUFuQixDQUFiO0FBQUEscUJBQWQ7QUFDSDtBQVJMO0FBQUE7QUFBQSx5Q0FTYTtBQUNMLDJCQUFPLDhCQUFDLGlCQUFELGVBQXVCLEtBQUtMLEtBQTVCLEVBQXVDLEtBQUtDLEtBQTVDLElBQW1ELGVBQWUsS0FBS0UsUUFBdkUsSUFBUDtBQUNIO0FBWEw7O0FBQUE7QUFBQTtBQWFILEtBZGM7QUFBQSxDIiwiZmlsZSI6IkxvY2FsU3RhdGVIb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7Q29tcG9uZW50fSBmcm9tICdyZWFjdCc7XG5cbi8qKlxuICogYExvY2FsU3RhdGVIb2NrKHJlZHVjZXI6IGZ1bmN0aW9uKHN0YXRlLCBhY3Rpb24pKSA9PiBmdW5jdGlvbihjb21wb25lbnQ6IENvbXBvbmVudClgXG5XcmFwcyBhIGNvbXBvbmVudCB3aXRoIGEgdGlueSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgcmVkdXggY29uY2VwdC4gVGFrZXMgYSByZWR1Y2VyIGFuZCByZXR1cm5zIGEgZnVuY3Rpb24gcmVhZHkgdG8gY2FsbCB3aXRoIGEgY29tcG9uZW50LiBUaGUgaG9jayBnaXZlcyB0aGUgY29tcG9uZW50IGBwcm9wcy5sb2NhbERpc3BhdGNoYHdoaWNoIHRyaWdnZXJzIHRoZSByZWR1Y2VyLiB0aGUgcmV0dXJuIHN0YXRlIG9mIHRoZSByZWR1Y2VyIGlzIHRoZW4gZGVzdHJ1Y3R1cmVkIG9uIHRvIHRoZSBjb21wb25lbnRzIGFzIHByb3BzLlxuICogQGV4cG9ydHMgTG9jYWxTdGF0ZUhvY2tcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSAgIHJlZHVjZXIgICAgICAgICAgICAgYSBmdW5jdGlvbiB0aGF0IGFjdHMgYXMgYSBsb2NhbCByZWR1Y2VyXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gICBjb21wb25lbnRDcmVhdG9yICAgIGZ1bmN0aW9uIHRvIHBhc3MgcmVhY3QgY29tcG9uZW50XG4gKi9cbmV4cG9ydCBkZWZhdWx0IChyZWR1Y2VyKSA9PiAoQ29tcG9zZWRDb21wb25lbnQpID0+IHtcbiAgICByZXR1cm4gY2xhc3MgTG9jYWxTdGF0ZUhvY2sgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IHJlZHVjZXIodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaCA9IHRoaXMuZGlzcGF0Y2guYmluZCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBkaXNwYXRjaChhY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUocHJldlN0YXRlID0+IHJlZHVjZXIocHJldlN0YXRlLCBhY3Rpb24pKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPENvbXBvc2VkQ29tcG9uZW50IHsuLi50aGlzLnByb3BzfSB7Li4udGhpcy5zdGF0ZX0gbG9jYWxEaXNwYXRjaD17dGhpcy5kaXNwYXRjaH0gLz47XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
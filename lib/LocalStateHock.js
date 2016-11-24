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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2NhbFN0YXRlSG9jay5qc3giXSwibmFtZXMiOlsicmVkdWNlciIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJzdGF0ZSIsInVuZGVmaW5lZCIsImRpc3BhdGNoIiwiYmluZCIsImFjdGlvbiIsInNldFN0YXRlIiwicHJldlN0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7O2tCQU9lLFVBQUNBLE9BQUQ7QUFBQSxXQUFhLFVBQUNDLGlCQUFELEVBQXVCO0FBQy9DO0FBQUE7O0FBQ0ksb0NBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSw0SUFDVEEsS0FEUzs7QUFFZixzQkFBS0MsS0FBTCxHQUFhSCxRQUFRSSxTQUFSLEVBQW1CLEVBQW5CLENBQWI7QUFDQSxzQkFBS0MsUUFBTCxHQUFnQixNQUFLQSxRQUFMLENBQWNDLElBQWQsT0FBaEI7QUFIZTtBQUlsQjs7QUFMTDtBQUFBO0FBQUEseUNBTWFDLE1BTmIsRUFNcUI7QUFDYix5QkFBS0MsUUFBTCxDQUFjO0FBQUEsK0JBQWFSLFFBQVFTLFNBQVIsRUFBbUJGLE1BQW5CLENBQWI7QUFBQSxxQkFBZDtBQUNIO0FBUkw7QUFBQTtBQUFBLHlDQVNhO0FBQ0wsMkJBQU8sOEJBQUMsaUJBQUQsZUFBdUIsS0FBS0wsS0FBNUIsRUFBdUMsS0FBS0MsS0FBNUMsSUFBbUQsZUFBZSxLQUFLRSxRQUF2RSxJQUFQO0FBQ0g7QUFYTDs7QUFBQTtBQUFBO0FBYUgsS0FkYztBQUFBLEMiLCJmaWxlIjoiTG9jYWxTdGF0ZUhvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHtDb21wb25lbnR9IGZyb20gJ3JlYWN0JztcblxuLyoqXG4gKiBgTG9jYWxTdGF0ZUhvY2socmVkdWNlcjogZnVuY3Rpb24oc3RhdGUsIGFjdGlvbikpID0+IGZ1bmN0aW9uKGNvbXBvbmVudDogQ29tcG9uZW50KWBcbldyYXBzIGEgY29tcG9uZW50IHdpdGggYSB0aW55IGltcGxlbWVudGF0aW9uIG9mIHRoZSByZWR1eCBjb25jZXB0LiBUYWtlcyBhIHJlZHVjZXIgYW5kIHJldHVybnMgYSBmdW5jdGlvbiByZWFkeSB0byBjYWxsIHdpdGggYSBjb21wb25lbnQuIFRoZSBob2NrIGdpdmVzIHRoZSBjb21wb25lbnQgYHByb3BzLmxvY2FsRGlzcGF0Y2hgd2hpY2ggdHJpZ2dlcnMgdGhlIHJlZHVjZXIuIHRoZSByZXR1cm4gc3RhdGUgb2YgdGhlIHJlZHVjZXIgaXMgdGhlbiBkZXN0cnVjdHVyZWQgb24gdG8gdGhlIGNvbXBvbmVudHMgYXMgcHJvcHMuXG4gKiBAZXhwb3J0cyBMb2NhbFN0YXRlSG9ja1xuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgcmVkdWNlciAgICAgICAgICAgICBhIGZ1bmN0aW9uIHRoYXQgYWN0cyBhcyBhIGxvY2FsIHJlZHVjZXJcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSAgIGNvbXBvbmVudENyZWF0b3IgICAgZnVuY3Rpb24gdG8gcGFzcyByZWFjdCBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHJlZHVjZXIpID0+IChDb21wb3NlZENvbXBvbmVudCkgPT4ge1xuICAgIHJldHVybiBjbGFzcyBMb2NhbFN0YXRlSG9jayBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcyk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gcmVkdWNlcih1bmRlZmluZWQsIHt9KTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2ggPSB0aGlzLmRpc3BhdGNoLmJpbmQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZGlzcGF0Y2goYWN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiByZWR1Y2VyKHByZXZTdGF0ZSwgYWN0aW9uKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIDxDb21wb3NlZENvbXBvbmVudCB7Li4udGhpcy5wcm9wc30gey4uLnRoaXMuc3RhdGV9IGxvY2FsRGlzcGF0Y2g9e3RoaXMuZGlzcGF0Y2h9IC8+O1xuICAgICAgICB9XG4gICAgfVxufVxuIl19
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ```js
 * PropChangeHock(propKeys: [String], sideEffect: function) => (component: Component) => Component
 * ```
 * The prop change hock takes a side effect and an array of prop keys paths.
 * The component then listens for component mount and receive props.
 * If any of the provided props change the side effect is triggered.
 * @exports PropChangeHock
 * @param  {Array}      propKeys            list of strings of prop keys
 * @param  {function}   outputFunction
 * @return {function}   componentCreator    function to pass react component
 */
exports.default = function () {
    var propKeys = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var outputFunction = arguments[1];
    return function (ComposedComponent) {
        return function (_Component) {
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

                    var propsHaveChanged = (0, _immutable.fromJS)(propKeys).some(function (ii) {
                        var keyPath = ii.split('.');
                        return !Immutable.is(thisPropsImmutable.getIn(keyPath), nextPropsImmutable.getIn(keyPath));
                    });

                    if (propsHaveChanged) {
                        outputFunction(nextProps);
                    }
                }
            }, {
                key: 'render',
                value: function render() {
                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        outputFunction: outputFunction.bind(null, this.props)
                    }));
                }
            }]);

            return AutoRequest;
        }(_react.Component);
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9wQ2hhbmdlSG9jay5qc3giXSwibmFtZXMiOlsicHJvcEtleXMiLCJvdXRwdXRGdW5jdGlvbiIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0IiwibmV4dFByb3BzIiwidGhpc1Byb3BzSW1tdXRhYmxlIiwibmV4dFByb3BzSW1tdXRhYmxlIiwicHJvcHNIYXZlQ2hhbmdlZCIsInNvbWUiLCJrZXlQYXRoIiwiaWkiLCJzcGxpdCIsIkltbXV0YWJsZSIsImlzIiwiZ2V0SW4iLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7a0JBWWU7QUFBQSxRQUFDQSxRQUFELHlEQUFZLEVBQVo7QUFBQSxRQUFnQkMsY0FBaEI7QUFBQSxXQUFtQyxVQUFDQyxpQkFBRCxFQUF1QjtBQUNyRTtBQUFBOztBQUNJLGlDQUFZQyxLQUFaLEVBQW1CQyxPQUFuQixFQUE0QjtBQUFBOztBQUFBLGlJQUNsQkQsS0FEa0IsRUFDWEMsT0FEVztBQUUzQjs7QUFITDtBQUFBO0FBQUEscURBSXlCO0FBQ2pCSCxtQ0FBZSxLQUFLRSxLQUFwQjtBQUNIO0FBTkw7QUFBQTtBQUFBLDBEQU84QkUsU0FQOUIsRUFPeUM7QUFDakM7QUFDQSx3QkFBTUMscUJBQXFCLHVCQUFPLEtBQUtILEtBQVosQ0FBM0I7QUFDQSx3QkFBTUkscUJBQXFCLHVCQUFPRixTQUFQLENBQTNCOztBQUVBLHdCQUFNRyxtQkFBbUIsdUJBQU9SLFFBQVAsRUFDcEJTLElBRG9CLENBQ2YsY0FBTTtBQUNSLDRCQUFNQyxVQUFVQyxHQUFHQyxLQUFILENBQVMsR0FBVCxDQUFoQjtBQUNBLCtCQUFPLENBQUNDLFVBQVVDLEVBQVYsQ0FDSlIsbUJBQW1CUyxLQUFuQixDQUF5QkwsT0FBekIsQ0FESSxFQUVKSCxtQkFBbUJRLEtBQW5CLENBQXlCTCxPQUF6QixDQUZJLENBQVI7QUFJSCxxQkFQb0IsQ0FBekI7O0FBU0Esd0JBQUdGLGdCQUFILEVBQXFCO0FBQ2pCUCx1Q0FBZUksU0FBZjtBQUNIO0FBQ0o7QUF4Qkw7QUFBQTtBQUFBLHlDQXlCYTtBQUNMLDJCQUFPLDhCQUFDLGlCQUFELGVBQ0MsS0FBS0YsS0FETjtBQUVILHdDQUFnQkYsZUFBZWUsSUFBZixDQUFvQixJQUFwQixFQUEwQixLQUFLYixLQUEvQjtBQUZiLHVCQUFQO0FBSUg7QUE5Qkw7O0FBQUE7QUFBQTtBQWdDSCxLQWpDYztBQUFBLEMiLCJmaWxlIjoiUHJvcENoYW5nZUhvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcblxuLyoqXG4gKiBgYGBqc1xuICogUHJvcENoYW5nZUhvY2socHJvcEtleXM6IFtTdHJpbmddLCBzaWRlRWZmZWN0OiBmdW5jdGlvbikgPT4gKGNvbXBvbmVudDogQ29tcG9uZW50KSA9PiBDb21wb25lbnRcbiAqIGBgYFxuICogVGhlIHByb3AgY2hhbmdlIGhvY2sgdGFrZXMgYSBzaWRlIGVmZmVjdCBhbmQgYW4gYXJyYXkgb2YgcHJvcCBrZXlzIHBhdGhzLlxuICogVGhlIGNvbXBvbmVudCB0aGVuIGxpc3RlbnMgZm9yIGNvbXBvbmVudCBtb3VudCBhbmQgcmVjZWl2ZSBwcm9wcy5cbiAqIElmIGFueSBvZiB0aGUgcHJvdmlkZWQgcHJvcHMgY2hhbmdlIHRoZSBzaWRlIGVmZmVjdCBpcyB0cmlnZ2VyZWQuXG4gKiBAZXhwb3J0cyBQcm9wQ2hhbmdlSG9ja1xuICogQHBhcmFtICB7QXJyYXl9ICAgICAgcHJvcEtleXMgICAgICAgICAgICBsaXN0IG9mIHN0cmluZ3Mgb2YgcHJvcCBrZXlzXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICBvdXRwdXRGdW5jdGlvblxuICogQHJldHVybiB7ZnVuY3Rpb259ICAgY29tcG9uZW50Q3JlYXRvciAgICBmdW5jdGlvbiB0byBwYXNzIHJlYWN0IGNvbXBvbmVudFxuICovXG5leHBvcnQgZGVmYXVsdCAocHJvcEtleXMgPSBbXSwgb3V0cHV0RnVuY3Rpb24pID0+IChDb21wb3NlZENvbXBvbmVudCkgPT4ge1xuICAgIHJldHVybiBjbGFzcyBBdXRvUmVxdWVzdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb24odGhpcy5wcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIC8vIG1ha2UgcHJvcHMgaW1tdXRhYmxlIE1hcHNcbiAgICAgICAgICAgIGNvbnN0IHRoaXNQcm9wc0ltbXV0YWJsZSA9IGZyb21KUyh0aGlzLnByb3BzKTtcbiAgICAgICAgICAgIGNvbnN0IG5leHRQcm9wc0ltbXV0YWJsZSA9IGZyb21KUyhuZXh0UHJvcHMpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9wc0hhdmVDaGFuZ2VkID0gZnJvbUpTKHByb3BLZXlzKVxuICAgICAgICAgICAgICAgIC5zb21lKGlpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qga2V5UGF0aCA9IGlpLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAhSW1tdXRhYmxlLmlzKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1Byb3BzSW1tdXRhYmxlLmdldEluKGtleVBhdGgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFByb3BzSW1tdXRhYmxlLmdldEluKGtleVBhdGgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmKHByb3BzSGF2ZUNoYW5nZWQpIHtcbiAgICAgICAgICAgICAgICBvdXRwdXRGdW5jdGlvbihuZXh0UHJvcHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiA8Q29tcG9zZWRDb21wb25lbnRcbiAgICAgICAgICAgICAgICB7Li4udGhpcy5wcm9wc31cbiAgICAgICAgICAgICAgICBvdXRwdXRGdW5jdGlvbj17b3V0cHV0RnVuY3Rpb24uYmluZChudWxsLCB0aGlzLnByb3BzKX1cbiAgICAgICAgICAgICAvPjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
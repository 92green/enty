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
                    return _react2.default.createElement(ComposedComponent, _extends({}, this.props, {
                        outputFunction: outputFunction.bind(null, this.props)
                    }));
                }
            }]);

            return AutoRequest;
        }(_react.Component);
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9wQ2hhbmdlSG9jay5qc3giXSwibmFtZXMiOlsicHJvcEtleXMiLCJvdXRwdXRGdW5jdGlvbiIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0IiwibmV4dFByb3BzIiwidGhpc1Byb3BzSW1tdXRhYmxlIiwibmV4dFByb3BzSW1tdXRhYmxlIiwiYm9vbGVhblRlc3QiLCJtYXAiLCJrZXlQYXRoIiwiaWkiLCJzcGxpdCIsImdldEluIiwiaW5kZXhPZiIsImJpbmQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztrQkFZZTtBQUFBLFFBQUNBLFFBQUQseURBQVksRUFBWjtBQUFBLFFBQWdCQyxjQUFoQjtBQUFBLFdBQW1DLFVBQUNDLGlCQUFELEVBQXVCO0FBQ3JFO0FBQUE7O0FBQ0ksaUNBQVlDLEtBQVosRUFBbUJDLE9BQW5CLEVBQTRCO0FBQUE7O0FBQUEsaUlBQ2xCRCxLQURrQixFQUNYQyxPQURXO0FBRTNCOztBQUhMO0FBQUE7QUFBQSxxREFJeUI7QUFDakJILG1DQUFlLEtBQUtFLEtBQXBCO0FBQ0g7QUFOTDtBQUFBO0FBQUEsMERBTzhCRSxTQVA5QixFQU95QztBQUNqQztBQUNBLHdCQUFJQyxxQkFBcUIsdUJBQU8sS0FBS0gsS0FBWixDQUF6QjtBQUNBLHdCQUFJSSxxQkFBcUIsdUJBQU9GLFNBQVAsQ0FBekI7O0FBRUEsd0JBQUlHLGNBQWNSLFNBQ2JTLEdBRGEsQ0FDVCxjQUFNO0FBQ1AsNEJBQUlDLFVBQVVDLEdBQUdDLEtBQUgsQ0FBUyxHQUFULENBQWQ7QUFDQSwrQkFBT04sbUJBQW1CTyxLQUFuQixDQUF5QkgsT0FBekIsTUFBc0NILG1CQUFtQk0sS0FBbkIsQ0FBeUJILE9BQXpCLENBQTdDO0FBQ0gscUJBSmEsRUFLYkksT0FMYSxDQUtMLElBTEssQ0FBbEI7O0FBT0Esd0JBQUdOLGdCQUFnQixDQUFDLENBQXBCLEVBQXVCO0FBQ25CUCx1Q0FBZUksU0FBZjtBQUNIO0FBQ0o7QUF0Qkw7QUFBQTtBQUFBLHlDQXVCYTtBQUNMLDJCQUFPLDhCQUFDLGlCQUFELGVBQ0MsS0FBS0YsS0FETjtBQUVILHdDQUFnQkYsZUFBZWMsSUFBZixDQUFvQixJQUFwQixFQUEwQixLQUFLWixLQUEvQjtBQUZiLHVCQUFQO0FBSUg7QUE1Qkw7O0FBQUE7QUFBQTtBQThCSCxLQS9CYztBQUFBLEMiLCJmaWxlIjoiUHJvcENoYW5nZUhvY2suanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50LCBQcm9wVHlwZXMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcblxuLyoqXG4gKiBgYGBqc1xuICogUHJvcENoYW5nZUhvY2socHJvcEtleXM6IFtTdHJpbmddLCBzaWRlRWZmZWN0OiBmdW5jdGlvbikgPT4gKGNvbXBvbmVudDogQ29tcG9uZW50KSA9PiBDb21wb25lbnRcbiAqIGBgYFxuICogVGhlIHByb3AgY2hhbmdlIGhvY2sgdGFrZXMgYSBzaWRlIGVmZmVjdCBhbmQgYW4gYXJyYXkgb2YgcHJvcCBrZXlzIHBhdGhzLlxuICogVGhlIGNvbXBvbmVudCB0aGVuIGxpc3RlbnMgZm9yIGNvbXBvbmVudCBtb3VudCBhbmQgcmVjZWl2ZSBwcm9wcy5cbiAqIElmIGFueSBvZiB0aGUgcHJvdmlkZWQgcHJvcHMgY2hhbmdlIHRoZSBzaWRlIGVmZmVjdCBpcyB0cmlnZ2VyZWQuXG4gKiBAZXhwb3J0cyBQcm9wQ2hhbmdlSG9ja1xuICogQHBhcmFtICB7QXJyYXl9ICAgICAgcHJvcEtleXMgICAgICAgICAgICBsaXN0IG9mIHN0cmluZ3Mgb2YgcHJvcCBrZXlzXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICBvdXRwdXRGdW5jdGlvblxuICogQHJldHVybiB7ZnVuY3Rpb259ICAgY29tcG9uZW50Q3JlYXRvciAgICBmdW5jdGlvbiB0byBwYXNzIHJlYWN0IGNvbXBvbmVudFxuICovXG5leHBvcnQgZGVmYXVsdCAocHJvcEtleXMgPSBbXSwgb3V0cHV0RnVuY3Rpb24pID0+IChDb21wb3NlZENvbXBvbmVudCkgPT4ge1xuICAgIHJldHVybiBjbGFzcyBBdXRvUmVxdWVzdCBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgICAgIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xuICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb24odGhpcy5wcm9wcyk7XG4gICAgICAgIH1cbiAgICAgICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICAgICAgICAgIC8vIG1ha2UgcHJvcHMgaW1tdXRhYmxlIE1hcHNcbiAgICAgICAgICAgIHZhciB0aGlzUHJvcHNJbW11dGFibGUgPSBmcm9tSlModGhpcy5wcm9wcyk7XG4gICAgICAgICAgICB2YXIgbmV4dFByb3BzSW1tdXRhYmxlID0gZnJvbUpTKG5leHRQcm9wcyk7XG5cbiAgICAgICAgICAgIHZhciBib29sZWFuVGVzdCA9IHByb3BLZXlzXG4gICAgICAgICAgICAgICAgLm1hcChpaSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBrZXlQYXRoID0gaWkuc3BsaXQoJy4nKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNQcm9wc0ltbXV0YWJsZS5nZXRJbihrZXlQYXRoKSAhPT0gbmV4dFByb3BzSW1tdXRhYmxlLmdldEluKGtleVBhdGgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmluZGV4T2YodHJ1ZSlcblxuICAgICAgICAgICAgaWYoYm9vbGVhblRlc3QgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb24obmV4dFByb3BzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPENvbXBvc2VkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb249e291dHB1dEZ1bmN0aW9uLmJpbmQobnVsbCwgdGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgLz47XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
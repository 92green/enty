'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

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
    var propKeys = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
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
                        return !_immutable2.default.is(thisPropsImmutable.getIn(keyPath), nextPropsImmutable.getIn(keyPath));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9wQ2hhbmdlSG9jay5qc3giXSwibmFtZXMiOlsicHJvcEtleXMiLCJvdXRwdXRGdW5jdGlvbiIsIkNvbXBvc2VkQ29tcG9uZW50IiwicHJvcHMiLCJjb250ZXh0IiwibmV4dFByb3BzIiwidGhpc1Byb3BzSW1tdXRhYmxlIiwibmV4dFByb3BzSW1tdXRhYmxlIiwicHJvcHNIYXZlQ2hhbmdlZCIsInNvbWUiLCJrZXlQYXRoIiwiaWkiLCJzcGxpdCIsImlzIiwiZ2V0SW4iLCJiaW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7OztrQkFZZTtBQUFBLFFBQUNBLFFBQUQsdUVBQVksRUFBWjtBQUFBLFFBQWdCQyxjQUFoQjtBQUFBLFdBQW1DLFVBQUNDLGlCQUFELEVBQXVCO0FBQ3JFO0FBQUE7O0FBQ0ksaUNBQVlDLEtBQVosRUFBbUJDLE9BQW5CLEVBQTRCO0FBQUE7O0FBQUEsaUlBQ2xCRCxLQURrQixFQUNYQyxPQURXO0FBRTNCOztBQUhMO0FBQUE7QUFBQSxxREFJeUI7QUFDakJILG1DQUFlLEtBQUtFLEtBQXBCO0FBQ0g7QUFOTDtBQUFBO0FBQUEsMERBTzhCRSxTQVA5QixFQU95QztBQUNqQztBQUNBLHdCQUFNQyxxQkFBcUIsdUJBQU8sS0FBS0gsS0FBWixDQUEzQjtBQUNBLHdCQUFNSSxxQkFBcUIsdUJBQU9GLFNBQVAsQ0FBM0I7O0FBRUEsd0JBQU1HLG1CQUFtQix1QkFBT1IsUUFBUCxFQUNwQlMsSUFEb0IsQ0FDZixjQUFNO0FBQ1IsNEJBQU1DLFVBQVVDLEdBQUdDLEtBQUgsQ0FBUyxHQUFULENBQWhCO0FBQ0EsK0JBQU8sQ0FBQyxvQkFBVUMsRUFBVixDQUNKUCxtQkFBbUJRLEtBQW5CLENBQXlCSixPQUF6QixDQURJLEVBRUpILG1CQUFtQk8sS0FBbkIsQ0FBeUJKLE9BQXpCLENBRkksQ0FBUjtBQUlILHFCQVBvQixDQUF6Qjs7QUFTQSx3QkFBR0YsZ0JBQUgsRUFBcUI7QUFDakJQLHVDQUFlSSxTQUFmO0FBQ0g7QUFDSjtBQXhCTDtBQUFBO0FBQUEseUNBeUJhO0FBQ0wsMkJBQU8sOEJBQUMsaUJBQUQsZUFDQyxLQUFLRixLQUROO0FBRUgsd0NBQWdCRixlQUFlYyxJQUFmLENBQW9CLElBQXBCLEVBQTBCLEtBQUtaLEtBQS9CO0FBRmIsdUJBQVA7QUFJSDtBQTlCTDs7QUFBQTtBQUFBO0FBZ0NILEtBakNjO0FBQUEsQyIsImZpbGUiOiJQcm9wQ2hhbmdlSG9jay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJbW11dGFibGUsIHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbi8qKlxuICogYGBganNcbiAqIFByb3BDaGFuZ2VIb2NrKHByb3BLZXlzOiBbU3RyaW5nXSwgc2lkZUVmZmVjdDogZnVuY3Rpb24pID0+IChjb21wb25lbnQ6IENvbXBvbmVudCkgPT4gQ29tcG9uZW50XG4gKiBgYGBcbiAqIFRoZSBwcm9wIGNoYW5nZSBob2NrIHRha2VzIGEgc2lkZSBlZmZlY3QgYW5kIGFuIGFycmF5IG9mIHByb3Aga2V5cyBwYXRocy5cbiAqIFRoZSBjb21wb25lbnQgdGhlbiBsaXN0ZW5zIGZvciBjb21wb25lbnQgbW91bnQgYW5kIHJlY2VpdmUgcHJvcHMuXG4gKiBJZiBhbnkgb2YgdGhlIHByb3ZpZGVkIHByb3BzIGNoYW5nZSB0aGUgc2lkZSBlZmZlY3QgaXMgdHJpZ2dlcmVkLlxuICogQGV4cG9ydHMgUHJvcENoYW5nZUhvY2tcbiAqIEBwYXJhbSAge0FycmF5fSAgICAgIHByb3BLZXlzICAgICAgICAgICAgbGlzdCBvZiBzdHJpbmdzIG9mIHByb3Aga2V5c1xuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgb3V0cHV0RnVuY3Rpb25cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSAgIGNvbXBvbmVudENyZWF0b3IgICAgZnVuY3Rpb24gdG8gcGFzcyByZWFjdCBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHByb3BLZXlzID0gW10sIG91dHB1dEZ1bmN0aW9uKSA9PiAoQ29tcG9zZWRDb21wb25lbnQpID0+IHtcbiAgICByZXR1cm4gY2xhc3MgQXV0b1JlcXVlc3QgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgICAgICBjb25zdHJ1Y3Rvcihwcm9wcywgY29udGV4dCkge1xuICAgICAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcbiAgICAgICAgICAgIG91dHB1dEZ1bmN0aW9uKHRoaXMucHJvcHMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgICAgICAgICAvLyBtYWtlIHByb3BzIGltbXV0YWJsZSBNYXBzXG4gICAgICAgICAgICBjb25zdCB0aGlzUHJvcHNJbW11dGFibGUgPSBmcm9tSlModGhpcy5wcm9wcyk7XG4gICAgICAgICAgICBjb25zdCBuZXh0UHJvcHNJbW11dGFibGUgPSBmcm9tSlMobmV4dFByb3BzKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvcHNIYXZlQ2hhbmdlZCA9IGZyb21KUyhwcm9wS2V5cylcbiAgICAgICAgICAgICAgICAuc29tZShpaSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGtleVBhdGggPSBpaS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gIUltbXV0YWJsZS5pcyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNQcm9wc0ltbXV0YWJsZS5nZXRJbihrZXlQYXRoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHRQcm9wc0ltbXV0YWJsZS5nZXRJbihrZXlQYXRoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZihwcm9wc0hhdmVDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb24obmV4dFByb3BzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gPENvbXBvc2VkQ29tcG9uZW50XG4gICAgICAgICAgICAgICAgey4uLnRoaXMucHJvcHN9XG4gICAgICAgICAgICAgICAgb3V0cHV0RnVuY3Rpb249e291dHB1dEZ1bmN0aW9uLmJpbmQobnVsbCwgdGhpcy5wcm9wcyl9XG4gICAgICAgICAgICAgLz47XG4gICAgICAgIH1cbiAgICB9XG59XG4iXX0=
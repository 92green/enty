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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWVyeUNvbm5lY3Rvci5qc3giXSwibmFtZXMiOlsiY29ubmVjdFdpdGhRdWVyeSIsImNvbm5lY3RvciIsInF1ZXJ5IiwicHJvcENoYW5nZUxpc3QiLCJDb21wb3NlZENvbXBvbmVudCIsInJlZHV4Q29ubmVjdCIsInByb3BDaGFuZ2VMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7OztBQUVPLElBQU1BLDhDQUFtQixTQUFuQkEsZ0JBQW1CLENBQUNDLFNBQUQsRUFBWUMsS0FBWixFQUFtQkMsY0FBbkI7QUFBQSxXQUFzQyxVQUFDQyxpQkFBRCxFQUF1Qjs7QUFFekYsWUFBTUMsZUFBZSx5QkFBUUosU0FBUixDQUFyQjtBQUNBLFlBQU1LLHFCQUFxQiw4QkFBZUgsY0FBZixFQUErQkQsS0FBL0IsQ0FBM0I7O0FBRUEsZUFBT0csYUFBYUMsbUJBQW1CRixpQkFBbkIsQ0FBYixDQUFQO0FBQ0gsS0FOK0I7QUFBQSxDQUF6QiIsImZpbGUiOiJRdWVyeUNvbm5lY3Rvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQsIFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7Y29ubmVjdH0gZnJvbSAncmVhY3QtcmVkdXgnO1xuaW1wb3J0IHtmcm9tSlN9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmltcG9ydCBQcm9wQ2hhbmdlSG9jayBmcm9tICcuL1Byb3BDaGFuZ2VIb2NrJ1xuXG5leHBvcnQgY29uc3QgY29ubmVjdFdpdGhRdWVyeSA9IChjb25uZWN0b3IsIHF1ZXJ5LCBwcm9wQ2hhbmdlTGlzdCkgPT4gKENvbXBvc2VkQ29tcG9uZW50KSA9PiB7XG5cbiAgICBjb25zdCByZWR1eENvbm5lY3QgPSBjb25uZWN0KGNvbm5lY3Rvcik7XG4gICAgY29uc3QgcHJvcENoYW5nZUxpc3RlbmVyID0gUHJvcENoYW5nZUhvY2socHJvcENoYW5nZUxpc3QsIHF1ZXJ5KTtcblxuICAgIHJldHVybiByZWR1eENvbm5lY3QocHJvcENoYW5nZUxpc3RlbmVyKENvbXBvc2VkQ29tcG9uZW50KSlcbn1cbiJdfQ==
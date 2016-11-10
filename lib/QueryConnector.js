'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectWithQuery = undefined;

var _reactRedux = require('react-redux');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9RdWVyeUNvbm5lY3Rvci5qc3giXSwibmFtZXMiOlsiY29ubmVjdFdpdGhRdWVyeSIsImNvbm5lY3RvciIsInF1ZXJ5IiwicHJvcENoYW5nZUxpc3QiLCJDb21wb3NlZENvbXBvbmVudCIsInJlZHV4Q29ubmVjdCIsInByb3BDaGFuZ2VMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUVBOzs7Ozs7QUFFTyxJQUFNQSw4Q0FBbUIsU0FBbkJBLGdCQUFtQixDQUFDQyxTQUFELEVBQVlDLEtBQVosRUFBbUJDLGNBQW5CO0FBQUEsV0FBc0MsVUFBQ0MsaUJBQUQsRUFBdUI7O0FBRXpGLFlBQU1DLGVBQWUseUJBQVFKLFNBQVIsQ0FBckI7QUFDQSxZQUFNSyxxQkFBcUIsOEJBQWVILGNBQWYsRUFBK0JELEtBQS9CLENBQTNCOztBQUVBLGVBQU9HLGFBQWFDLG1CQUFtQkYsaUJBQW5CLENBQWIsQ0FBUDtBQUNILEtBTitCO0FBQUEsQ0FBekIiLCJmaWxlIjoiUXVlcnlDb25uZWN0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Nvbm5lY3R9IGZyb20gJ3JlYWN0LXJlZHV4JztcblxuaW1wb3J0IFByb3BDaGFuZ2VIb2NrIGZyb20gJy4vUHJvcENoYW5nZUhvY2snXG5cbmV4cG9ydCBjb25zdCBjb25uZWN0V2l0aFF1ZXJ5ID0gKGNvbm5lY3RvciwgcXVlcnksIHByb3BDaGFuZ2VMaXN0KSA9PiAoQ29tcG9zZWRDb21wb25lbnQpID0+IHtcblxuICAgIGNvbnN0IHJlZHV4Q29ubmVjdCA9IGNvbm5lY3QoY29ubmVjdG9yKTtcbiAgICBjb25zdCBwcm9wQ2hhbmdlTGlzdGVuZXIgPSBQcm9wQ2hhbmdlSG9jayhwcm9wQ2hhbmdlTGlzdCwgcXVlcnkpO1xuXG4gICAgcmV0dXJuIHJlZHV4Q29ubmVjdChwcm9wQ2hhbmdlTGlzdGVuZXIoQ29tcG9zZWRDb21wb25lbnQpKVxufVxuIl19
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _CreateEntityQuery = require('../CreateEntityQuery');

var _CreateEntityQuery2 = _interopRequireDefault(_CreateEntityQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('CreateEntityQuery', function (tt) {
    var action = function action() {};
    var queryCreator = function queryCreator() {
        return 'query';
    };

    var entityQuery = (0, _CreateEntityQuery2.default)(action);
    var hockedComponent = entityQuery(queryCreator, ['keys']);

    tt.is(typeof entityQuery === 'undefined' ? 'undefined' : _typeof(entityQuery), 'function', 'it should return a function');
    tt.is(typeof hockedComponent === 'undefined' ? 'undefined' : _typeof(hockedComponent), 'function', 'its hockedComponent should be a function');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vQ3JlYXRlRW50aXR5UXVlcnktdGVzdC5qcyJdLCJuYW1lcyI6WyJhY3Rpb24iLCJxdWVyeUNyZWF0b3IiLCJlbnRpdHlRdWVyeSIsImhvY2tlZENvbXBvbmVudCIsInR0IiwiaXMiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFJQSxtQkFBSyxtQkFBTCxFQUEwQixjQUFNO0FBQzVCLFFBQUlBLFNBQVMsU0FBVEEsTUFBUyxHQUFNLENBQUUsQ0FBckI7QUFDQSxRQUFJQyxlQUFlLFNBQWZBLFlBQWU7QUFBQTtBQUFBLEtBQW5COztBQUVBLFFBQUlDLGNBQWMsaUNBQWtCRixNQUFsQixDQUFsQjtBQUNBLFFBQUlHLGtCQUFrQkQsWUFBWUQsWUFBWixFQUEwQixDQUFDLE1BQUQsQ0FBMUIsQ0FBdEI7O0FBRUFHLE9BQUdDLEVBQUgsUUFBYUgsV0FBYix5Q0FBYUEsV0FBYixHQUEwQixVQUExQixFQUFzQyw2QkFBdEM7QUFDQUUsT0FBR0MsRUFBSCxRQUFhRixlQUFiLHlDQUFhQSxlQUFiLEdBQThCLFVBQTlCLEVBQTJDLDBDQUEzQztBQUNILENBVEQiLCJmaWxlIjoiQ3JlYXRlRW50aXR5UXVlcnktdGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0ZXN0IGZyb20gJ2F2YSc7XG5pbXBvcnQgQ3JlYXRlRW50aXR5UXVlcnkgZnJvbSAnLi4vQ3JlYXRlRW50aXR5UXVlcnknO1xuXG5cblxudGVzdCgnQ3JlYXRlRW50aXR5UXVlcnknLCB0dCA9PiB7XG4gICAgdmFyIGFjdGlvbiA9ICgpID0+IHt9O1xuICAgIHZhciBxdWVyeUNyZWF0b3IgPSAoKSA9PiBgcXVlcnlgO1xuXG4gICAgdmFyIGVudGl0eVF1ZXJ5ID0gQ3JlYXRlRW50aXR5UXVlcnkoYWN0aW9uKTtcbiAgICB2YXIgaG9ja2VkQ29tcG9uZW50ID0gZW50aXR5UXVlcnkocXVlcnlDcmVhdG9yLCBbJ2tleXMnXSk7XG5cbiAgICB0dC5pcyh0eXBlb2YgZW50aXR5UXVlcnksICdmdW5jdGlvbicsICdpdCBzaG91bGQgcmV0dXJuIGEgZnVuY3Rpb24nKTtcbiAgICB0dC5pcyh0eXBlb2YgaG9ja2VkQ29tcG9uZW50LCAnZnVuY3Rpb24nICwgJ2l0cyBob2NrZWRDb21wb25lbnQgc2hvdWxkIGJlIGEgZnVuY3Rpb24nKTtcbn0pO1xuIl19
'use strict';

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _sinon = require('sinon');

var _immutable = require('immutable');

var _CreateRequestActions = require('../CreateRequestActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _ava2.default)('createRequestActionSet', function (tt) {
    var actions = (0, _CreateRequestActions.createRequestActionSet)({
        foo: {
            bar: function bar() {}
        }
    });

    tt.true(typeof actions.requestFooBar === 'function', 'should have an action creator');
    tt.is(actions.FOO_BAR_FETCH, 'FOO_BAR_FETCH', 'should have FETCH action type');
    tt.is(actions.FOO_BAR_RECEIVE, 'FOO_BAR_RECEIVE', 'should have RECIEVE action type');
    tt.is(actions.FOO_BAR_ERROR, 'FOO_BAR_ERROR', 'should have ERROR action type');
});

(0, _ava2.default)('reduceActionMap', function (tt) {
    var actions = (0, _immutable.fromJS)({
        foo: {
            bar: 'baz'
        }
    });

    tt.is((0, _CreateRequestActions.reduceActionMap)(actions).get('FOO_BAR'), 'baz');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9fX3Rlc3RzX18vQ3JlYXRlUmVxdWVzdEFjdGlvbnMtdGVzdC5qcyJdLCJuYW1lcyI6WyJhY3Rpb25zIiwiZm9vIiwiYmFyIiwidHQiLCJ0cnVlIiwicmVxdWVzdEZvb0JhciIsImlzIiwiRk9PX0JBUl9GRVRDSCIsIkZPT19CQVJfUkVDRUlWRSIsIkZPT19CQVJfRVJST1IiLCJnZXQiXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7QUFDQTs7OztBQVFBLG1CQUFLLHdCQUFMLEVBQStCLGNBQU07QUFDakMsUUFBSUEsVUFBVSxrREFBdUI7QUFDakNDLGFBQUs7QUFDREMsaUJBQUssZUFBTSxDQUFFO0FBRFo7QUFENEIsS0FBdkIsQ0FBZDs7QUFNQUMsT0FBR0MsSUFBSCxDQUFRLE9BQU9KLFFBQVFLLGFBQWYsS0FBaUMsVUFBekMsRUFBcUQsK0JBQXJEO0FBQ0FGLE9BQUdHLEVBQUgsQ0FBTU4sUUFBUU8sYUFBZCxFQUE2QixlQUE3QixFQUE4QywrQkFBOUM7QUFDQUosT0FBR0csRUFBSCxDQUFNTixRQUFRUSxlQUFkLEVBQStCLGlCQUEvQixFQUFrRCxpQ0FBbEQ7QUFDQUwsT0FBR0csRUFBSCxDQUFNTixRQUFRUyxhQUFkLEVBQTZCLGVBQTdCLEVBQThDLCtCQUE5QztBQUNILENBWEQ7O0FBZUEsbUJBQUssaUJBQUwsRUFBd0IsY0FBTTtBQUMxQixRQUFJVCxVQUFVLHVCQUFPO0FBQ2pCQyxhQUFLO0FBQ0RDLGlCQUFLO0FBREo7QUFEWSxLQUFQLENBQWQ7O0FBTUFDLE9BQUdHLEVBQUgsQ0FBTSwyQ0FBZ0JOLE9BQWhCLEVBQXlCVSxHQUF6QixDQUE2QixTQUE3QixDQUFOLEVBQStDLEtBQS9DO0FBQ0gsQ0FSRCIsImZpbGUiOiJDcmVhdGVSZXF1ZXN0QWN0aW9ucy10ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRlc3QgZnJvbSAnYXZhJztcbmltcG9ydCB7c3B5fSBmcm9tICdzaW5vbic7XG5pbXBvcnQge2Zyb21KU30gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7XG4gICAgcmVkdWNlQWN0aW9uTWFwLFxuICAgIGNyZWF0ZVJlcXVlc3RBY3Rpb24sXG4gICAgY3JlYXRlUmVxdWVzdEFjdGlvblNldFxufSBmcm9tICcuLi9DcmVhdGVSZXF1ZXN0QWN0aW9ucyc7XG5cblxuXG50ZXN0KCdjcmVhdGVSZXF1ZXN0QWN0aW9uU2V0JywgdHQgPT4ge1xuICAgIHZhciBhY3Rpb25zID0gY3JlYXRlUmVxdWVzdEFjdGlvblNldCh7XG4gICAgICAgIGZvbzoge1xuICAgICAgICAgICAgYmFyOiAoKSA9PiB7fVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB0dC50cnVlKHR5cGVvZiBhY3Rpb25zLnJlcXVlc3RGb29CYXIgPT09ICdmdW5jdGlvbicsICdzaG91bGQgaGF2ZSBhbiBhY3Rpb24gY3JlYXRvcicpO1xuICAgIHR0LmlzKGFjdGlvbnMuRk9PX0JBUl9GRVRDSCwgJ0ZPT19CQVJfRkVUQ0gnLCAnc2hvdWxkIGhhdmUgRkVUQ0ggYWN0aW9uIHR5cGUnKTtcbiAgICB0dC5pcyhhY3Rpb25zLkZPT19CQVJfUkVDRUlWRSwgJ0ZPT19CQVJfUkVDRUlWRScsICdzaG91bGQgaGF2ZSBSRUNJRVZFIGFjdGlvbiB0eXBlJyk7XG4gICAgdHQuaXMoYWN0aW9ucy5GT09fQkFSX0VSUk9SLCAnRk9PX0JBUl9FUlJPUicsICdzaG91bGQgaGF2ZSBFUlJPUiBhY3Rpb24gdHlwZScpO1xufSk7XG5cblxuXG50ZXN0KCdyZWR1Y2VBY3Rpb25NYXAnLCB0dCA9PiB7XG4gICAgdmFyIGFjdGlvbnMgPSBmcm9tSlMoe1xuICAgICAgICBmb286IHtcbiAgICAgICAgICAgIGJhcjogJ2JheidcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdHQuaXMocmVkdWNlQWN0aW9uTWFwKGFjdGlvbnMpLmdldCgnRk9PX0JBUicpLCAnYmF6Jyk7XG59KTtcbiJdfQ==
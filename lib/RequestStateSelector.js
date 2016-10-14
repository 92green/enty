'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.selectRequestState = selectRequestState;

var _immutable = require('immutable');

/**
 * Returns the state of a current request. Either fetching, error or not yet requested.
 * @param  {object} state   the current state
 * @param  {(string|array)} actions either one or many partial action types
 * @return {object}         the curerent request state
 */
function selectRequestState(state, actions) {
    // use custom request state if not provided
    var requestState = state.requestState || (0, _immutable.Map)(state);

    switch (typeof actions === 'undefined' ? 'undefined' : _typeof(actions)) {
        case 'string':
            return requestState
            // filter out provided single actions from requestState
            .filter(function (ii, key) {
                return key.indexOf(actions) > -1;
            })
            // reduce to just fetch,error,receive
            .reduce(function (rr, ii, kk) {
                return rr.set((0, _immutable.List)(kk.split('_')).last().toLowerCase(), ii);
            }, (0, _immutable.Map)()).toObject();

        default:
            return requestState
            // filter out provided list of actions from requestState
            .filter(function (ii, key) {
                return actions.filter(function (action) {
                    return key.indexOf(action) > -1;
                }).length > 0;
            })
            // reduce to camelCase version of action names
            .reduce(function (rr, ii, kk) {
                var keyPath = key.split('_')
                // TitleCase
                .map(function (ss) {
                    return ss.toLowerCase().replace(/^./, function (ii) {
                        return ii.toUpperCase();
                    });
                }).join('')
                // lowerCase first makes camelCase
                .replace(/^./, function (ii) {
                    return ii.toLowerCase();
                });

                return rr.set(keyPath, value);
            }, (0, _immutable.Map)()).toObject();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXF1ZXN0U3RhdGVTZWxlY3Rvci5qcyJdLCJuYW1lcyI6WyJzZWxlY3RSZXF1ZXN0U3RhdGUiLCJzdGF0ZSIsImFjdGlvbnMiLCJyZXF1ZXN0U3RhdGUiLCJmaWx0ZXIiLCJpaSIsImtleSIsImluZGV4T2YiLCJyZWR1Y2UiLCJyciIsImtrIiwic2V0Iiwic3BsaXQiLCJsYXN0IiwidG9Mb3dlckNhc2UiLCJ0b09iamVjdCIsImFjdGlvbiIsImxlbmd0aCIsImtleVBhdGgiLCJtYXAiLCJzcyIsInJlcGxhY2UiLCJ0b1VwcGVyQ2FzZSIsImpvaW4iLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFRZ0JBLGtCLEdBQUFBLGtCOztBQVJoQjs7QUFFQTs7Ozs7O0FBTU8sU0FBU0Esa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DQyxPQUFuQyxFQUE0QztBQUMvQztBQUNBLFFBQUlDLGVBQWVGLE1BQU1FLFlBQU4sSUFBc0Isb0JBQUlGLEtBQUosQ0FBekM7O0FBRUEsbUJBQWNDLE9BQWQseUNBQWNBLE9BQWQ7QUFDSSxhQUFLLFFBQUw7QUFDSSxtQkFBT0M7QUFDSDtBQURHLGFBRUZDLE1BRkUsQ0FFSyxVQUFDQyxFQUFELEVBQUtDLEdBQUw7QUFBQSx1QkFBYUEsSUFBSUMsT0FBSixDQUFZTCxPQUFaLElBQXVCLENBQUMsQ0FBckM7QUFBQSxhQUZMO0FBR0g7QUFIRyxhQUlGTSxNQUpFLENBSUssVUFBQ0MsRUFBRCxFQUFLSixFQUFMLEVBQVNLLEVBQVQsRUFBZ0I7QUFDcEIsdUJBQU9ELEdBQUdFLEdBQUgsQ0FBTyxxQkFBS0QsR0FBR0UsS0FBSCxDQUFTLEdBQVQsQ0FBTCxFQUFvQkMsSUFBcEIsR0FBMkJDLFdBQTNCLEVBQVAsRUFBaURULEVBQWpELENBQVA7QUFDSCxhQU5FLEVBTUEscUJBTkEsRUFPRlUsUUFQRSxFQUFQOztBQVNKO0FBQ0ksbUJBQU9aO0FBQ0g7QUFERyxhQUVGQyxNQUZFLENBRUssVUFBQ0MsRUFBRCxFQUFLQyxHQUFMO0FBQUEsdUJBQWFKLFFBQVFFLE1BQVIsQ0FBZTtBQUFBLDJCQUFVRSxJQUFJQyxPQUFKLENBQVlTLE1BQVosSUFBc0IsQ0FBQyxDQUFqQztBQUFBLGlCQUFmLEVBQW1EQyxNQUFuRCxHQUE0RCxDQUF6RTtBQUFBLGFBRkw7QUFHSDtBQUhHLGFBSUZULE1BSkUsQ0FJSyxVQUFDQyxFQUFELEVBQUtKLEVBQUwsRUFBU0ssRUFBVCxFQUFnQjtBQUNwQixvQkFBSVEsVUFBVVosSUFDVE0sS0FEUyxDQUNILEdBREc7QUFFVjtBQUZVLGlCQUdUTyxHQUhTLENBR0w7QUFBQSwyQkFBTUMsR0FBR04sV0FBSCxHQUFpQk8sT0FBakIsQ0FBeUIsSUFBekIsRUFBK0I7QUFBQSwrQkFBTWhCLEdBQUdpQixXQUFILEVBQU47QUFBQSxxQkFBL0IsQ0FBTjtBQUFBLGlCQUhLLEVBSVRDLElBSlMsQ0FJSixFQUpJO0FBS1Y7QUFMVSxpQkFNVEYsT0FOUyxDQU1ELElBTkMsRUFNSztBQUFBLDJCQUFNaEIsR0FBR1MsV0FBSCxFQUFOO0FBQUEsaUJBTkwsQ0FBZDs7QUFRQSx1QkFBT0wsR0FBR0UsR0FBSCxDQUFPTyxPQUFQLEVBQWdCTSxLQUFoQixDQUFQO0FBQ0gsYUFkRSxFQWNBLHFCQWRBLEVBZUZULFFBZkUsRUFBUDtBQVpSO0FBK0JIIiwiZmlsZSI6IlJlcXVlc3RTdGF0ZVNlbGVjdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNYXAsIExpc3R9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RhdGUgb2YgYSBjdXJyZW50IHJlcXVlc3QuIEVpdGhlciBmZXRjaGluZywgZXJyb3Igb3Igbm90IHlldCByZXF1ZXN0ZWQuXG4gKiBAcGFyYW0gIHtvYmplY3R9IHN0YXRlICAgdGhlIGN1cnJlbnQgc3RhdGVcbiAqIEBwYXJhbSAgeyhzdHJpbmd8YXJyYXkpfSBhY3Rpb25zIGVpdGhlciBvbmUgb3IgbWFueSBwYXJ0aWFsIGFjdGlvbiB0eXBlc1xuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgIHRoZSBjdXJlcmVudCByZXF1ZXN0IHN0YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZWxlY3RSZXF1ZXN0U3RhdGUoc3RhdGUsIGFjdGlvbnMpIHtcbiAgICAvLyB1c2UgY3VzdG9tIHJlcXVlc3Qgc3RhdGUgaWYgbm90IHByb3ZpZGVkXG4gICAgdmFyIHJlcXVlc3RTdGF0ZSA9IHN0YXRlLnJlcXVlc3RTdGF0ZSB8fCBNYXAoc3RhdGUpO1xuXG4gICAgc3dpdGNoKHR5cGVvZiBhY3Rpb25zKSB7XG4gICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdFN0YXRlXG4gICAgICAgICAgICAgICAgLy8gZmlsdGVyIG91dCBwcm92aWRlZCBzaW5nbGUgYWN0aW9ucyBmcm9tIHJlcXVlc3RTdGF0ZVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGlpLCBrZXkpID0+IGtleS5pbmRleE9mKGFjdGlvbnMpID4gLTEpXG4gICAgICAgICAgICAgICAgLy8gcmVkdWNlIHRvIGp1c3QgZmV0Y2gsZXJyb3IscmVjZWl2ZVxuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHJyLCBpaSwga2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJyLnNldChMaXN0KGtrLnNwbGl0KCdfJykpLmxhc3QoKS50b0xvd2VyQ2FzZSgpLCBpaSk7XG4gICAgICAgICAgICAgICAgfSwgTWFwKCkpXG4gICAgICAgICAgICAgICAgLnRvT2JqZWN0KCk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiByZXF1ZXN0U3RhdGVcbiAgICAgICAgICAgICAgICAvLyBmaWx0ZXIgb3V0IHByb3ZpZGVkIGxpc3Qgb2YgYWN0aW9ucyBmcm9tIHJlcXVlc3RTdGF0ZVxuICAgICAgICAgICAgICAgIC5maWx0ZXIoKGlpLCBrZXkpID0+IGFjdGlvbnMuZmlsdGVyKGFjdGlvbiA9PiBrZXkuaW5kZXhPZihhY3Rpb24pID4gLTEpLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgLy8gcmVkdWNlIHRvIGNhbWVsQ2FzZSB2ZXJzaW9uIG9mIGFjdGlvbiBuYW1lc1xuICAgICAgICAgICAgICAgIC5yZWR1Y2UoKHJyLCBpaSwga2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleVBhdGggPSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdCgnXycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaXRsZUNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoc3MgPT4gc3MudG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9eLi8sIGlpID0+IGlpLnRvVXBwZXJDYXNlKCkpKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBsb3dlckNhc2UgZmlyc3QgbWFrZXMgY2FtZWxDYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXi4vLCBpaSA9PiBpaS50b0xvd2VyQ2FzZSgpKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnIuc2V0KGtleVBhdGgsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9LCBNYXAoKSlcbiAgICAgICAgICAgICAgICAudG9PYmplY3QoKTtcbiAgICB9XG5cblxufVxuIl19
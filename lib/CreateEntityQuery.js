'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = entityQuery;

var _QueryConnector = require('./QueryConnector');

var _EntitySelector = require('./EntitySelector');

var _immutable = require('immutable');

function hash(query) {
    if ((typeof query === 'undefined' ? 'undefined' : _typeof(query)) !== 'object' && typeof query !== 'string') {
        throw new TypeError('Invalid query type');
    }

    query = JSON.stringify(query);
    var hash = 0;
    var i;
    var chr;
    var len;
    if (query.length === 0) return hash;
    for (i = 0, len = query.length; i < len; i++) {
        chr = query.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect
 * @param  {function} sideEffect
 * @return {function} action creator
 */
function entityQuery(action) {
    return function (queryCreator, propUpdateKeys, metaOverride) {

        return function (composedComponent) {
            var withQuery = (0, _QueryConnector.connectWithQuery)(function (state, props) {
                var resultKey = hash(queryCreator(props));
                return _extends({}, (0, _EntitySelector.selectEntity)(state, resultKey), {
                    requestState: state.entity.getIn(['_requestState', resultKey], (0, _immutable.Map)()).toJS()
                });
            }, function (props) {
                var payload = action(queryCreator(props));
                var meta = Object.assign({}, {
                    resultKey: hash(queryCreator(props))
                }, metaOverride);

                return props.dispatch(payload, meta);
            }, propUpdateKeys);

            return withQuery(composedComponent);
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlRdWVyeS5qcyJdLCJuYW1lcyI6WyJlbnRpdHlRdWVyeSIsImhhc2giLCJxdWVyeSIsIlR5cGVFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJpIiwiY2hyIiwibGVuIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsImFjdGlvbiIsInF1ZXJ5Q3JlYXRvciIsInByb3BVcGRhdGVLZXlzIiwibWV0YU92ZXJyaWRlIiwiY29tcG9zZWRDb21wb25lbnQiLCJ3aXRoUXVlcnkiLCJzdGF0ZSIsInByb3BzIiwicmVzdWx0S2V5IiwicmVxdWVzdFN0YXRlIiwiZW50aXR5IiwiZ2V0SW4iLCJ0b0pTIiwicGF5bG9hZCIsIm1ldGEiLCJPYmplY3QiLCJhc3NpZ24iLCJkaXNwYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztrQkE4QndCQSxXOztBQTlCeEI7O0FBQ0E7O0FBQ0E7O0FBRUEsU0FBU0MsSUFBVCxDQUFjQyxLQUFkLEVBQXFCO0FBQ2pCLFFBQUcsUUFBT0EsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFqQixJQUE2QixPQUFPQSxLQUFQLEtBQWlCLFFBQWpELEVBQTJEO0FBQ3ZELGNBQU0sSUFBSUMsU0FBSixDQUFjLG9CQUFkLENBQU47QUFDSDs7QUFFREQsWUFBUUUsS0FBS0MsU0FBTCxDQUFlSCxLQUFmLENBQVI7QUFDQSxRQUFJRCxPQUFPLENBQVg7QUFDQSxRQUFJSyxDQUFKO0FBQ0EsUUFBSUMsR0FBSjtBQUNBLFFBQUlDLEdBQUo7QUFDQSxRQUFJTixNQUFNTyxNQUFOLEtBQWlCLENBQXJCLEVBQXdCLE9BQU9SLElBQVA7QUFDeEIsU0FBS0ssSUFBSSxDQUFKLEVBQU9FLE1BQU1OLE1BQU1PLE1BQXhCLEVBQWdDSCxJQUFJRSxHQUFwQyxFQUF5Q0YsR0FBekMsRUFBOEM7QUFDMUNDLGNBQVFMLE1BQU1RLFVBQU4sQ0FBaUJKLENBQWpCLENBQVI7QUFDQUwsZUFBUyxDQUFDQSxRQUFRLENBQVQsSUFBY0EsSUFBZixHQUF1Qk0sR0FBL0I7QUFDQU4sZ0JBQVEsQ0FBUixDQUgwQyxDQUcvQjtBQUNkO0FBQ0QsV0FBT0EsSUFBUDtBQUNIOztBQUlEOzs7OztBQUtlLFNBQVNELFdBQVQsQ0FBcUJXLE1BQXJCLEVBQTZCO0FBQ3hDLFdBQU8sVUFBQ0MsWUFBRCxFQUFlQyxjQUFmLEVBQStCQyxZQUEvQixFQUFnRDs7QUFFbkQsZUFBTyxVQUFDQyxpQkFBRCxFQUF1QjtBQUMxQixnQkFBTUMsWUFBWSxzQ0FDZCxVQUFDQyxLQUFELEVBQVFDLEtBQVIsRUFBa0I7QUFDZCxvQkFBTUMsWUFBWWxCLEtBQUtXLGFBQWFNLEtBQWIsQ0FBTCxDQUFsQjtBQUNBLG9DQUNPLGtDQUFhRCxLQUFiLEVBQW9CRSxTQUFwQixDQURQO0FBRUlDLGtDQUFlSCxNQUFNSSxNQUFOLENBQWFDLEtBQWIsQ0FBbUIsQ0FBQyxlQUFELEVBQWtCSCxTQUFsQixDQUFuQixFQUFpRCxxQkFBakQsRUFBd0RJLElBQXhEO0FBRm5CO0FBSUgsYUFQYSxFQVFkLFVBQUNMLEtBQUQsRUFBVztBQUNQLG9CQUFNTSxVQUFVYixPQUFPQyxhQUFhTSxLQUFiLENBQVAsQ0FBaEI7QUFDQSxvQkFBTU8sT0FBT0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0I7QUFDM0JSLCtCQUFXbEIsS0FBS1csYUFBYU0sS0FBYixDQUFMO0FBRGdCLGlCQUFsQixFQUVWSixZQUZVLENBQWI7O0FBSUEsdUJBQU9JLE1BQU1VLFFBQU4sQ0FBZUosT0FBZixFQUF3QkMsSUFBeEIsQ0FBUDtBQUNILGFBZmEsRUFnQmRaLGNBaEJjLENBQWxCOztBQW1CQSxtQkFBT0csVUFBVUQsaUJBQVYsQ0FBUDtBQUNILFNBckJEO0FBdUJILEtBekJEO0FBMEJIIiwiZmlsZSI6IkNyZWF0ZUVudGl0eVF1ZXJ5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjb25uZWN0V2l0aFF1ZXJ5fSBmcm9tICcuL1F1ZXJ5Q29ubmVjdG9yJztcbmltcG9ydCB7c2VsZWN0RW50aXR5fSBmcm9tICcuL0VudGl0eVNlbGVjdG9yJztcbmltcG9ydCB7TWFwfSBmcm9tICdpbW11dGFibGUnO1xuXG5mdW5jdGlvbiBoYXNoKHF1ZXJ5KSB7XG4gICAgaWYodHlwZW9mIHF1ZXJ5ICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgcXVlcnkgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgcXVlcnkgdHlwZScpO1xuICAgIH1cblxuICAgIHF1ZXJ5ID0gSlNPTi5zdHJpbmdpZnkocXVlcnkpO1xuICAgIHZhciBoYXNoID0gMFxuICAgIHZhciBpO1xuICAgIHZhciBjaHI7XG4gICAgdmFyIGxlbjtcbiAgICBpZiAocXVlcnkubGVuZ3RoID09PSAwKSByZXR1cm4gaGFzaDtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBxdWVyeS5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjaHIgICA9IHF1ZXJ5LmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGhhc2ggID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBjaHI7XG4gICAgICAgIGhhc2ggfD0gMDsgLy8gQ29udmVydCB0byAzMmJpdCBpbnRlZ2VyXG4gICAgfVxuICAgIHJldHVybiBoYXNoO1xufTtcblxuXG5cbi8qKlxuICogVGFrZXMgYW4gYWN0aW9uIGNyZWF0b3IgYW5kIGdpdmVzIGl0IGEgYHJlc3VsdEtleWAuIHdyYXBzIGl0IGluIFByb3BDaGFuZ2VIb2NrLCBlbnRpdHlTZWxlY3QgYW5kIHJlcXVlc3RTdGF0ZVNlbGVjdFxuICogQHBhcmFtICB7ZnVuY3Rpb259IHNpZGVFZmZlY3RcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBhY3Rpb24gY3JlYXRvclxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBlbnRpdHlRdWVyeShhY3Rpb24pIHtcbiAgICByZXR1cm4gKHF1ZXJ5Q3JlYXRvciwgcHJvcFVwZGF0ZUtleXMsIG1ldGFPdmVycmlkZSkgPT4ge1xuXG4gICAgICAgIHJldHVybiAoY29tcG9zZWRDb21wb25lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdpdGhRdWVyeSA9IGNvbm5lY3RXaXRoUXVlcnkoXG4gICAgICAgICAgICAgICAgKHN0YXRlLCBwcm9wcykgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRLZXkgPSBoYXNoKHF1ZXJ5Q3JlYXRvcihwcm9wcykpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLi4uc2VsZWN0RW50aXR5KHN0YXRlLCByZXN1bHRLZXkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdFN0YXRlIDogc3RhdGUuZW50aXR5LmdldEluKFsnX3JlcXVlc3RTdGF0ZScsIHJlc3VsdEtleV0sIE1hcCgpKS50b0pTKClcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKHByb3BzKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSBhY3Rpb24ocXVlcnlDcmVhdG9yKHByb3BzKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHt9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRLZXk6IGhhc2gocXVlcnlDcmVhdG9yKHByb3BzKSlcbiAgICAgICAgICAgICAgICAgICAgfSwgbWV0YU92ZXJyaWRlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHMuZGlzcGF0Y2gocGF5bG9hZCwgbWV0YSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9wVXBkYXRlS2V5c1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHdpdGhRdWVyeShjb21wb3NlZENvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbiJdfQ==
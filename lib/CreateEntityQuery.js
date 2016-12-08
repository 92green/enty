'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = entityQuery;

var _QueryConnector = require('./QueryConnector');

var _EntitySelector = require('./EntitySelector');

var _immutable = require('immutable');

/**
 * Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect
 * @param  {function} sideEffect
 * @return {function} action creator
 */
function entityQuery(action) {
    return function (queryCreator, propUpdateKeys, metaOverride) {

        return function (composedComponent) {
            var withQuery = (0, _QueryConnector.connectWithQuery)(function connector(state, props) {
                var resultKey = (0, _immutable.fromJS)({ hash: queryCreator(props) }).hashCode();
                return _extends({}, (0, _EntitySelector.selectEntity)(state, resultKey), {
                    requestState: state.entity.getIn(['_requestState', resultKey], (0, _immutable.Map)()).toJS()
                });
            }, function query(props) {
                var resultKey = (0, _immutable.fromJS)({ hash: queryCreator(props) }).hashCode();
                var meta = Object.assign({}, { resultKey: resultKey }, metaOverride);

                return props.dispatch(action(queryCreator(props), meta));
            }, propUpdateKeys);

            return withQuery(composedComponent);
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlRdWVyeS5qcyJdLCJuYW1lcyI6WyJlbnRpdHlRdWVyeSIsImFjdGlvbiIsInF1ZXJ5Q3JlYXRvciIsInByb3BVcGRhdGVLZXlzIiwibWV0YU92ZXJyaWRlIiwiY29tcG9zZWRDb21wb25lbnQiLCJ3aXRoUXVlcnkiLCJjb25uZWN0b3IiLCJzdGF0ZSIsInByb3BzIiwicmVzdWx0S2V5IiwiaGFzaCIsImhhc2hDb2RlIiwicmVxdWVzdFN0YXRlIiwiZW50aXR5IiwiZ2V0SW4iLCJ0b0pTIiwicXVlcnkiLCJtZXRhIiwiT2JqZWN0IiwiYXNzaWduIiwiZGlzcGF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O2tCQVN3QkEsVzs7QUFUeEI7O0FBQ0E7O0FBQ0E7O0FBRUE7Ozs7O0FBS2UsU0FBU0EsV0FBVCxDQUFxQkMsTUFBckIsRUFBNkI7QUFDeEMsV0FBTyxVQUFDQyxZQUFELEVBQWVDLGNBQWYsRUFBK0JDLFlBQS9CLEVBQWdEOztBQUVuRCxlQUFPLFVBQUNDLGlCQUFELEVBQXVCO0FBQzFCLGdCQUFNQyxZQUFZLHNDQUNkLFNBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCQyxLQUExQixFQUFpQztBQUM3QixvQkFBTUMsWUFBWSx1QkFBTyxFQUFDQyxNQUFNVCxhQUFhTyxLQUFiLENBQVAsRUFBUCxFQUFvQ0csUUFBcEMsRUFBbEI7QUFDQSxvQ0FDTyxrQ0FBYUosS0FBYixFQUFvQkUsU0FBcEIsQ0FEUDtBQUVJRyxrQ0FBZUwsTUFBTU0sTUFBTixDQUFhQyxLQUFiLENBQW1CLENBQUMsZUFBRCxFQUFrQkwsU0FBbEIsQ0FBbkIsRUFBaUQscUJBQWpELEVBQXdETSxJQUF4RDtBQUZuQjtBQUlILGFBUGEsRUFRZCxTQUFTQyxLQUFULENBQWVSLEtBQWYsRUFBc0I7QUFDbEIsb0JBQU1DLFlBQVksdUJBQU8sRUFBQ0MsTUFBTVQsYUFBYU8sS0FBYixDQUFQLEVBQVAsRUFBb0NHLFFBQXBDLEVBQWxCO0FBQ0Esb0JBQU1NLE9BQU9DLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEVBQUNWLG9CQUFELEVBQWxCLEVBQStCTixZQUEvQixDQUFiOztBQUVBLHVCQUFPSyxNQUFNWSxRQUFOLENBQWVwQixPQUFPQyxhQUFhTyxLQUFiLENBQVAsRUFBNEJTLElBQTVCLENBQWYsQ0FBUDtBQUNILGFBYmEsRUFjZGYsY0FkYyxDQUFsQjs7QUFpQkEsbUJBQU9HLFVBQVVELGlCQUFWLENBQVA7QUFDSCxTQW5CRDtBQXFCSCxLQXZCRDtBQXdCSCIsImZpbGUiOiJDcmVhdGVFbnRpdHlRdWVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29ubmVjdFdpdGhRdWVyeX0gZnJvbSAnLi9RdWVyeUNvbm5lY3Rvcic7XG5pbXBvcnQge3NlbGVjdEVudGl0eX0gZnJvbSAnLi9FbnRpdHlTZWxlY3Rvcic7XG5pbXBvcnQge2Zyb21KUywgTWFwfSBmcm9tICdpbW11dGFibGUnO1xuXG4vKipcbiAqIFRha2VzIGFuIGFjdGlvbiBjcmVhdG9yIGFuZCBnaXZlcyBpdCBhIGByZXN1bHRLZXlgLiB3cmFwcyBpdCBpbiBQcm9wQ2hhbmdlSG9jaywgZW50aXR5U2VsZWN0IGFuZCByZXF1ZXN0U3RhdGVTZWxlY3RcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBzaWRlRWZmZWN0XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gYWN0aW9uIGNyZWF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW50aXR5UXVlcnkoYWN0aW9uKSB7XG4gICAgcmV0dXJuIChxdWVyeUNyZWF0b3IsIHByb3BVcGRhdGVLZXlzLCBtZXRhT3ZlcnJpZGUpID0+IHtcblxuICAgICAgICByZXR1cm4gKGNvbXBvc2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB3aXRoUXVlcnkgPSBjb25uZWN0V2l0aFF1ZXJ5KFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNvbm5lY3RvcihzdGF0ZSwgcHJvcHMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0S2V5ID0gZnJvbUpTKHtoYXNoOiBxdWVyeUNyZWF0b3IocHJvcHMpfSkuaGFzaENvZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLnNlbGVjdEVudGl0eShzdGF0ZSwgcmVzdWx0S2V5KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcXVlc3RTdGF0ZSA6IHN0YXRlLmVudGl0eS5nZXRJbihbJ19yZXF1ZXN0U3RhdGUnLCByZXN1bHRLZXldLCBNYXAoKSkudG9KUygpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHF1ZXJ5KHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEtleSA9IGZyb21KUyh7aGFzaDogcXVlcnlDcmVhdG9yKHByb3BzKX0pLmhhc2hDb2RlKCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBPYmplY3QuYXNzaWduKHt9LCB7cmVzdWx0S2V5fSwgbWV0YU92ZXJyaWRlKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcHMuZGlzcGF0Y2goYWN0aW9uKHF1ZXJ5Q3JlYXRvcihwcm9wcyksIG1ldGEpKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHByb3BVcGRhdGVLZXlzXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICByZXR1cm4gd2l0aFF1ZXJ5KGNvbXBvc2VkQ29tcG9uZW50KTtcbiAgICAgICAgfVxuXG4gICAgfVxufVxuIl19
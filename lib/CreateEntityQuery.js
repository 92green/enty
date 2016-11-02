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
    return function (queryCreator, propUpdateKeys) {
        return function (composedComponent) {
            return (0, _QueryConnector.connectWithQuery)(function (state, props) {
                var resultKey = hash(queryCreator(props));
                return _extends({}, (0, _EntitySelector.selectEntity)(state, resultKey), {
                    requestState: state.entity.getIn(['_requestState', resultKey], (0, _immutable.Map)()).toJS()
                });
            }, function (props) {
                return props.dispatch(action(queryCreator(props), { resultKey: hash(queryCreator(props)) }));
            }, propUpdateKeys)(composedComponent);
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlRdWVyeS5qcyJdLCJuYW1lcyI6WyJlbnRpdHlRdWVyeSIsImhhc2giLCJxdWVyeSIsIlR5cGVFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJpIiwiY2hyIiwibGVuIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsImFjdGlvbiIsInF1ZXJ5Q3JlYXRvciIsInByb3BVcGRhdGVLZXlzIiwiY29tcG9zZWRDb21wb25lbnQiLCJzdGF0ZSIsInByb3BzIiwicmVzdWx0S2V5IiwicmVxdWVzdFN0YXRlIiwiZW50aXR5IiwiZ2V0SW4iLCJ0b0pTIiwiZGlzcGF0Y2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7a0JBOEJ3QkEsVzs7QUE5QnhCOztBQUNBOztBQUNBOztBQUVBLFNBQVNDLElBQVQsQ0FBY0MsS0FBZCxFQUFxQjtBQUNqQixRQUFHLFFBQU9BLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsUUFBakIsSUFBNkIsT0FBT0EsS0FBUCxLQUFpQixRQUFqRCxFQUEyRDtBQUN2RCxjQUFNLElBQUlDLFNBQUosQ0FBYyxvQkFBZCxDQUFOO0FBQ0g7O0FBRURELFlBQVFFLEtBQUtDLFNBQUwsQ0FBZUgsS0FBZixDQUFSO0FBQ0EsUUFBSUQsT0FBTyxDQUFYO0FBQ0EsUUFBSUssQ0FBSjtBQUNBLFFBQUlDLEdBQUo7QUFDQSxRQUFJQyxHQUFKO0FBQ0EsUUFBSU4sTUFBTU8sTUFBTixLQUFpQixDQUFyQixFQUF3QixPQUFPUixJQUFQO0FBQ3hCLFNBQUtLLElBQUksQ0FBSixFQUFPRSxNQUFNTixNQUFNTyxNQUF4QixFQUFnQ0gsSUFBSUUsR0FBcEMsRUFBeUNGLEdBQXpDLEVBQThDO0FBQzFDQyxjQUFRTCxNQUFNUSxVQUFOLENBQWlCSixDQUFqQixDQUFSO0FBQ0FMLGVBQVMsQ0FBQ0EsUUFBUSxDQUFULElBQWNBLElBQWYsR0FBdUJNLEdBQS9CO0FBQ0FOLGdCQUFRLENBQVIsQ0FIMEMsQ0FHL0I7QUFDZDtBQUNELFdBQU9BLElBQVA7QUFDSDs7QUFJRDs7Ozs7QUFLZSxTQUFTRCxXQUFULENBQXFCVyxNQUFyQixFQUE2QjtBQUN4QyxXQUFPLFVBQUNDLFlBQUQsRUFBZUMsY0FBZixFQUFrQztBQUNyQyxlQUFPLFVBQUNDLGlCQUFEO0FBQUEsbUJBQXVCLHNDQUMxQixVQUFDQyxLQUFELEVBQVFDLEtBQVIsRUFBa0I7QUFDZCxvQkFBTUMsWUFBWWhCLEtBQUtXLGFBQWFJLEtBQWIsQ0FBTCxDQUFsQjtBQUNBLG9DQUNPLGtDQUFhRCxLQUFiLEVBQW9CRSxTQUFwQixDQURQO0FBRUlDLGtDQUFlSCxNQUFNSSxNQUFOLENBQWFDLEtBQWIsQ0FBbUIsQ0FBQyxlQUFELEVBQWtCSCxTQUFsQixDQUFuQixFQUFpRCxxQkFBakQsRUFBd0RJLElBQXhEO0FBRm5CO0FBSUgsYUFQeUIsRUFRMUI7QUFBQSx1QkFBU0wsTUFBTU0sUUFBTixDQUFlWCxPQUFPQyxhQUFhSSxLQUFiLENBQVAsRUFBNEIsRUFBQ0MsV0FBV2hCLEtBQUtXLGFBQWFJLEtBQWIsQ0FBTCxDQUFaLEVBQTVCLENBQWYsQ0FBVDtBQUFBLGFBUjBCLEVBUzFCSCxjQVQwQixFQVU1QkMsaUJBVjRCLENBQXZCO0FBQUEsU0FBUDtBQVlILEtBYkQ7QUFjSCIsImZpbGUiOiJDcmVhdGVFbnRpdHlRdWVyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y29ubmVjdFdpdGhRdWVyeX0gZnJvbSAnLi9RdWVyeUNvbm5lY3Rvcic7XG5pbXBvcnQge3NlbGVjdEVudGl0eX0gZnJvbSAnLi9FbnRpdHlTZWxlY3Rvcic7XG5pbXBvcnQge01hcH0gZnJvbSAnaW1tdXRhYmxlJztcblxuZnVuY3Rpb24gaGFzaChxdWVyeSkge1xuICAgIGlmKHR5cGVvZiBxdWVyeSAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHF1ZXJ5ICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIHF1ZXJ5IHR5cGUnKTtcbiAgICB9XG5cbiAgICBxdWVyeSA9IEpTT04uc3RyaW5naWZ5KHF1ZXJ5KTtcbiAgICB2YXIgaGFzaCA9IDBcbiAgICB2YXIgaTtcbiAgICB2YXIgY2hyO1xuICAgIHZhciBsZW47XG4gICAgaWYgKHF1ZXJ5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuIGhhc2g7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcXVlcnkubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY2hyICAgPSBxdWVyeS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBoYXNoICA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hyO1xuICAgICAgICBoYXNoIHw9IDA7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICAgIH1cbiAgICByZXR1cm4gaGFzaDtcbn07XG5cblxuXG4vKipcbiAqIFRha2VzIGFuIGFjdGlvbiBjcmVhdG9yIGFuZCBnaXZlcyBpdCBhIGByZXN1bHRLZXlgLiB3cmFwcyBpdCBpbiBQcm9wQ2hhbmdlSG9jaywgZW50aXR5U2VsZWN0IGFuZCByZXF1ZXN0U3RhdGVTZWxlY3RcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBzaWRlRWZmZWN0XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gYWN0aW9uIGNyZWF0b3JcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZW50aXR5UXVlcnkoYWN0aW9uKSB7XG4gICAgcmV0dXJuIChxdWVyeUNyZWF0b3IsIHByb3BVcGRhdGVLZXlzKSA9PiB7XG4gICAgICAgIHJldHVybiAoY29tcG9zZWRDb21wb25lbnQpID0+IGNvbm5lY3RXaXRoUXVlcnkoXG4gICAgICAgICAgICAoc3RhdGUsIHByb3BzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0S2V5ID0gaGFzaChxdWVyeUNyZWF0b3IocHJvcHMpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICAuLi5zZWxlY3RFbnRpdHkoc3RhdGUsIHJlc3VsdEtleSksXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RTdGF0ZSA6IHN0YXRlLmVudGl0eS5nZXRJbihbJ19yZXF1ZXN0U3RhdGUnLCByZXN1bHRLZXldLCBNYXAoKSkudG9KUygpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb3BzID0+IHByb3BzLmRpc3BhdGNoKGFjdGlvbihxdWVyeUNyZWF0b3IocHJvcHMpLCB7cmVzdWx0S2V5OiBoYXNoKHF1ZXJ5Q3JlYXRvcihwcm9wcykpfSkpLFxuICAgICAgICAgICAgcHJvcFVwZGF0ZUtleXNcbiAgICAgICAgKShjb21wb3NlZENvbXBvbmVudClcblxuICAgIH1cbn1cbiJdfQ==
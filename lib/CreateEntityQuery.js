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
            var withQuery = (0, _QueryConnector.connectWithQuery)(function connector(state, props) {
                var resultKey = hash(queryCreator(props));
                return _extends({}, (0, _EntitySelector.selectEntity)(state, resultKey), {
                    requestState: state.entity.getIn(['_requestState', resultKey], (0, _immutable.Map)()).toJS()
                });
            }, function query(props) {
                var meta = Object.assign({}, {
                    resultKey: hash(queryCreator(props))
                }, metaOverride);

                return props.dispatch(action(queryCreator(props), meta));
            }, propUpdateKeys);

            return withQuery(composedComponent);
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVFbnRpdHlRdWVyeS5qcyJdLCJuYW1lcyI6WyJlbnRpdHlRdWVyeSIsImhhc2giLCJxdWVyeSIsIlR5cGVFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJpIiwiY2hyIiwibGVuIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsImFjdGlvbiIsInF1ZXJ5Q3JlYXRvciIsInByb3BVcGRhdGVLZXlzIiwibWV0YU92ZXJyaWRlIiwiY29tcG9zZWRDb21wb25lbnQiLCJ3aXRoUXVlcnkiLCJjb25uZWN0b3IiLCJzdGF0ZSIsInByb3BzIiwicmVzdWx0S2V5IiwicmVxdWVzdFN0YXRlIiwiZW50aXR5IiwiZ2V0SW4iLCJ0b0pTIiwibWV0YSIsIk9iamVjdCIsImFzc2lnbiIsImRpc3BhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2tCQThCd0JBLFc7O0FBOUJ4Qjs7QUFDQTs7QUFDQTs7QUFFQSxTQUFTQyxJQUFULENBQWNDLEtBQWQsRUFBcUI7QUFDakIsUUFBRyxRQUFPQSxLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQWpCLElBQTZCLE9BQU9BLEtBQVAsS0FBaUIsUUFBakQsRUFBMkQ7QUFDdkQsY0FBTSxJQUFJQyxTQUFKLENBQWMsb0JBQWQsQ0FBTjtBQUNIOztBQUVERCxZQUFRRSxLQUFLQyxTQUFMLENBQWVILEtBQWYsQ0FBUjtBQUNBLFFBQUlELE9BQU8sQ0FBWDtBQUNBLFFBQUlLLENBQUo7QUFDQSxRQUFJQyxHQUFKO0FBQ0EsUUFBSUMsR0FBSjtBQUNBLFFBQUlOLE1BQU1PLE1BQU4sS0FBaUIsQ0FBckIsRUFBd0IsT0FBT1IsSUFBUDtBQUN4QixTQUFLSyxJQUFJLENBQUosRUFBT0UsTUFBTU4sTUFBTU8sTUFBeEIsRUFBZ0NILElBQUlFLEdBQXBDLEVBQXlDRixHQUF6QyxFQUE4QztBQUMxQ0MsY0FBUUwsTUFBTVEsVUFBTixDQUFpQkosQ0FBakIsQ0FBUjtBQUNBTCxlQUFTLENBQUNBLFFBQVEsQ0FBVCxJQUFjQSxJQUFmLEdBQXVCTSxHQUEvQjtBQUNBTixnQkFBUSxDQUFSLENBSDBDLENBRy9CO0FBQ2Q7QUFDRCxXQUFPQSxJQUFQO0FBQ0g7O0FBSUQ7Ozs7O0FBS2UsU0FBU0QsV0FBVCxDQUFxQlcsTUFBckIsRUFBNkI7QUFDeEMsV0FBTyxVQUFDQyxZQUFELEVBQWVDLGNBQWYsRUFBK0JDLFlBQS9CLEVBQWdEOztBQUVuRCxlQUFPLFVBQUNDLGlCQUFELEVBQXVCO0FBQzFCLGdCQUFNQyxZQUFZLHNDQUNkLFNBQVNDLFNBQVQsQ0FBbUJDLEtBQW5CLEVBQTBCQyxLQUExQixFQUFpQztBQUM3QixvQkFBTUMsWUFBWW5CLEtBQUtXLGFBQWFPLEtBQWIsQ0FBTCxDQUFsQjtBQUNBLG9DQUNPLGtDQUFhRCxLQUFiLEVBQW9CRSxTQUFwQixDQURQO0FBRUlDLGtDQUFlSCxNQUFNSSxNQUFOLENBQWFDLEtBQWIsQ0FBbUIsQ0FBQyxlQUFELEVBQWtCSCxTQUFsQixDQUFuQixFQUFpRCxxQkFBakQsRUFBd0RJLElBQXhEO0FBRm5CO0FBSUgsYUFQYSxFQVFkLFNBQVN0QixLQUFULENBQWVpQixLQUFmLEVBQXNCO0FBQ2xCLG9CQUFNTSxPQUFPQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQjtBQUMzQlAsK0JBQVduQixLQUFLVyxhQUFhTyxLQUFiLENBQUw7QUFEZ0IsaUJBQWxCLEVBRVZMLFlBRlUsQ0FBYjs7QUFJQSx1QkFBT0ssTUFBTVMsUUFBTixDQUFlakIsT0FBT0MsYUFBYU8sS0FBYixDQUFQLEVBQTRCTSxJQUE1QixDQUFmLENBQVA7QUFDSCxhQWRhLEVBZWRaLGNBZmMsQ0FBbEI7O0FBa0JBLG1CQUFPRyxVQUFVRCxpQkFBVixDQUFQO0FBQ0gsU0FwQkQ7QUFzQkgsS0F4QkQ7QUF5QkgiLCJmaWxlIjoiQ3JlYXRlRW50aXR5UXVlcnkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Nvbm5lY3RXaXRoUXVlcnl9IGZyb20gJy4vUXVlcnlDb25uZWN0b3InO1xuaW1wb3J0IHtzZWxlY3RFbnRpdHl9IGZyb20gJy4vRW50aXR5U2VsZWN0b3InO1xuaW1wb3J0IHtNYXB9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmZ1bmN0aW9uIGhhc2gocXVlcnkpIHtcbiAgICBpZih0eXBlb2YgcXVlcnkgIT09ICdvYmplY3QnICYmIHR5cGVvZiBxdWVyeSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBxdWVyeSB0eXBlJyk7XG4gICAgfVxuXG4gICAgcXVlcnkgPSBKU09OLnN0cmluZ2lmeShxdWVyeSk7XG4gICAgdmFyIGhhc2ggPSAwXG4gICAgdmFyIGk7XG4gICAgdmFyIGNocjtcbiAgICB2YXIgbGVuO1xuICAgIGlmIChxdWVyeS5sZW5ndGggPT09IDApIHJldHVybiBoYXNoO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHF1ZXJ5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNociAgID0gcXVlcnkuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaGFzaCAgPSAoKGhhc2ggPDwgNSkgLSBoYXNoKSArIGNocjtcbiAgICAgICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgICB9XG4gICAgcmV0dXJuIGhhc2g7XG59O1xuXG5cblxuLyoqXG4gKiBUYWtlcyBhbiBhY3Rpb24gY3JlYXRvciBhbmQgZ2l2ZXMgaXQgYSBgcmVzdWx0S2V5YC4gd3JhcHMgaXQgaW4gUHJvcENoYW5nZUhvY2ssIGVudGl0eVNlbGVjdCBhbmQgcmVxdWVzdFN0YXRlU2VsZWN0XG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gc2lkZUVmZmVjdFxuICogQHJldHVybiB7ZnVuY3Rpb259IGFjdGlvbiBjcmVhdG9yXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGVudGl0eVF1ZXJ5KGFjdGlvbikge1xuICAgIHJldHVybiAocXVlcnlDcmVhdG9yLCBwcm9wVXBkYXRlS2V5cywgbWV0YU92ZXJyaWRlKSA9PiB7XG5cbiAgICAgICAgcmV0dXJuIChjb21wb3NlZENvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd2l0aFF1ZXJ5ID0gY29ubmVjdFdpdGhRdWVyeShcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBjb25uZWN0b3Ioc3RhdGUsIHByb3BzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3VsdEtleSA9IGhhc2gocXVlcnlDcmVhdG9yKHByb3BzKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5zZWxlY3RFbnRpdHkoc3RhdGUsIHJlc3VsdEtleSksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0U3RhdGUgOiBzdGF0ZS5lbnRpdHkuZ2V0SW4oWydfcmVxdWVzdFN0YXRlJywgcmVzdWx0S2V5XSwgTWFwKCkpLnRvSlMoKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBxdWVyeShwcm9wcykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gT2JqZWN0LmFzc2lnbih7fSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0S2V5OiBoYXNoKHF1ZXJ5Q3JlYXRvcihwcm9wcykpXG4gICAgICAgICAgICAgICAgICAgIH0sIG1ldGFPdmVycmlkZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzLmRpc3BhdGNoKGFjdGlvbihxdWVyeUNyZWF0b3IocHJvcHMpLCBtZXRhKSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwcm9wVXBkYXRlS2V5c1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgcmV0dXJuIHdpdGhRdWVyeShjb21wb3NlZENvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgIH1cbn1cbiJdfQ==
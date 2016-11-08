'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.logRequestActionNames = logRequestActionNames;
exports.reduceActionMap = reduceActionMap;
exports.createRequestActionSet = createRequestActionSet;
exports.createRequestAction = createRequestAction;

var _reduxActions = require('redux-actions');

var _immutable = require('immutable');

/**
 * Given the return value of creatRequestActionSet it will log the names of the created action types and creators
 * @param  {object} actionMap map of actions
 * @param  {string} prefix    String to prefix actions types with
 */
function logRequestActionNames(actionMap, prefix) {
    console.log(Object.keys(createRequestActionSet(actionMap, prefix)).join('\n'));
}

//
// Turns a nested object into a flat
// UPPER_SNAKE case represention
function reduceActionMap(branch) {
    var parentKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    return branch.reduce(function (rr, ii, key) {
        var prefix = '' + parentKey + key.toUpperCase();
        if (_immutable.Map.isMap(ii)) {
            return rr.merge(reduceActionMap(ii, prefix + '_'));
        } else {
            return rr.set(prefix, ii);
        }
    }, (0, _immutable.Map)());
}

/**
 * returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.
 * dispatch `fetchAction`
 * call `sideEffect`
 * then dispatch `recieveAction`
 * catch dispatch `errorAction`
 *
 * @param  {object} actionMap deep object representation of api functions
 * @return {array}            list of action creators and action types
 */
function createRequestActionSet(actionMap) {
    return reduceActionMap((0, _immutable.fromJS)(actionMap)).map(function (sideEffect, action) {
        var FETCH = action + '_FETCH';
        var RECEIVE = action + '_RECEIVE';
        var ERROR = action + '_ERROR';

        var requestActionName = action.split('_').map(function (ss) {
            return ss.toLowerCase().replace(/^./, function (mm) {
                return mm.toUpperCase();
            });
        }).join('');

        return (0, _immutable.Map)().set('request' + requestActionName, createRequestAction(FETCH, RECEIVE, ERROR, sideEffect)).set(FETCH, FETCH).set(RECEIVE, RECEIVE).set(ERROR, ERROR);
    }).flatten(1).toJS();
}

function createRequestAction(fetchAction, recieveAction, errorAction, sideEffect) {
    function action(aa) {
        return (0, _reduxActions.createAction)(aa, function (payload) {
            return payload;
        }, function (payload, meta) {
            return meta;
        });
    }
    return function (requestPayload) {
        var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        return function (dispatch, getState) {
            var sideEffectMeta = _extends({}, meta, {
                dispatch: dispatch,
                getState: getState
            });

            var actionMeta = function actionMeta(resultKey) {
                return _extends({}, meta, {
                    resultKey: meta.resultKey || resultKey
                });
            };

            dispatch(action(fetchAction)(null, { resultKey: meta.resultKey || fetchAction }));
            return sideEffect(requestPayload, sideEffectMeta).then(function (data) {
                return Promise.resolve(dispatch(action(recieveAction)(data, actionMeta(recieveAction))));
            }, function (error) {
                return dispatch((0, _reduxActions.createAction)(errorAction)(error, { resultKey: meta.resultKey || errorAction }));
            });
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVSZXF1ZXN0QWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJsb2dSZXF1ZXN0QWN0aW9uTmFtZXMiLCJyZWR1Y2VBY3Rpb25NYXAiLCJjcmVhdGVSZXF1ZXN0QWN0aW9uU2V0IiwiY3JlYXRlUmVxdWVzdEFjdGlvbiIsImFjdGlvbk1hcCIsInByZWZpeCIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiam9pbiIsImJyYW5jaCIsInBhcmVudEtleSIsInJlZHVjZSIsInJyIiwiaWkiLCJrZXkiLCJ0b1VwcGVyQ2FzZSIsImlzTWFwIiwibWVyZ2UiLCJzZXQiLCJtYXAiLCJzaWRlRWZmZWN0IiwiYWN0aW9uIiwiRkVUQ0giLCJSRUNFSVZFIiwiRVJST1IiLCJyZXF1ZXN0QWN0aW9uTmFtZSIsInNwbGl0Iiwic3MiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJtbSIsImZsYXR0ZW4iLCJ0b0pTIiwiZmV0Y2hBY3Rpb24iLCJyZWNpZXZlQWN0aW9uIiwiZXJyb3JBY3Rpb24iLCJhYSIsInBheWxvYWQiLCJtZXRhIiwicmVxdWVzdFBheWxvYWQiLCJkaXNwYXRjaCIsImdldFN0YXRlIiwic2lkZUVmZmVjdE1ldGEiLCJhY3Rpb25NZXRhIiwicmVzdWx0S2V5IiwidGhlbiIsImRhdGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVFnQkEscUIsR0FBQUEscUI7UUFPQUMsZSxHQUFBQSxlO1FBcUJBQyxzQixHQUFBQSxzQjtRQXVCQUMsbUIsR0FBQUEsbUI7O0FBM0RoQjs7QUFDQTs7QUFFQTs7Ozs7QUFLTyxTQUFTSCxxQkFBVCxDQUErQkksU0FBL0IsRUFBMENDLE1BQTFDLEVBQWtEO0FBQ3JEQyxZQUFRQyxHQUFSLENBQVlDLE9BQU9DLElBQVAsQ0FBWVAsdUJBQXVCRSxTQUF2QixFQUFrQ0MsTUFBbEMsQ0FBWixFQUF1REssSUFBdkQsQ0FBNEQsSUFBNUQsQ0FBWjtBQUNIOztBQUVE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LElBQXRCLEVBQTRCSCxXQUFXVCxhQUFYLENBQTVCLENBQVQsQ0FBaEIsQ0FBUDtBQUNILGFBSEUsRUFJSCxVQUFDZSxLQUFELEVBQVc7QUFDUCx1QkFBT1QsU0FBUyxnQ0FBYUwsV0FBYixFQUEwQmMsS0FBMUIsRUFBaUMsRUFBQ0wsV0FBV04sS0FBS00sU0FBTCxJQUFrQlQsV0FBOUIsRUFBakMsQ0FBVCxDQUFQO0FBQ0gsYUFORSxDQUFQO0FBUUgsU0FyQk07QUFBQSxLQUFQO0FBc0JIIiwiZmlsZSI6IkNyZWF0ZVJlcXVlc3RBY3Rpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtjcmVhdGVBY3Rpb259IGZyb20gJ3JlZHV4LWFjdGlvbnMnO1xuaW1wb3J0IHtmcm9tSlMsIE1hcH0gZnJvbSAnaW1tdXRhYmxlJztcblxuLyoqXG4gKiBHaXZlbiB0aGUgcmV0dXJuIHZhbHVlIG9mIGNyZWF0UmVxdWVzdEFjdGlvblNldCBpdCB3aWxsIGxvZyB0aGUgbmFtZXMgb2YgdGhlIGNyZWF0ZWQgYWN0aW9uIHR5cGVzIGFuZCBjcmVhdG9yc1xuICogQHBhcmFtICB7b2JqZWN0fSBhY3Rpb25NYXAgbWFwIG9mIGFjdGlvbnNcbiAqIEBwYXJhbSAge3N0cmluZ30gcHJlZml4ICAgIFN0cmluZyB0byBwcmVmaXggYWN0aW9ucyB0eXBlcyB3aXRoXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsb2dSZXF1ZXN0QWN0aW9uTmFtZXMoYWN0aW9uTWFwLCBwcmVmaXgpIHtcbiAgICBjb25zb2xlLmxvZyhPYmplY3Qua2V5cyhjcmVhdGVSZXF1ZXN0QWN0aW9uU2V0KGFjdGlvbk1hcCwgcHJlZml4KSkuam9pbignXFxuJykpO1xufVxuXG4vL1xuLy8gVHVybnMgYSBuZXN0ZWQgb2JqZWN0IGludG8gYSBmbGF0XG4vLyBVUFBFUl9TTkFLRSBjYXNlIHJlcHJlc2VudGlvblxuZXhwb3J0IGZ1bmN0aW9uIHJlZHVjZUFjdGlvbk1hcChicmFuY2gsIHBhcmVudEtleSA9ICcnKSB7XG4gICAgcmV0dXJuIGJyYW5jaC5yZWR1Y2UoKHJyLCBpaSwga2V5KSA9PiB7XG4gICAgICAgIHZhciBwcmVmaXggPSBgJHtwYXJlbnRLZXl9JHtrZXkudG9VcHBlckNhc2UoKX1gO1xuICAgICAgICBpZihNYXAuaXNNYXAoaWkpKSB7XG4gICAgICAgICAgICByZXR1cm4gcnIubWVyZ2UocmVkdWNlQWN0aW9uTWFwKGlpLCBgJHtwcmVmaXh9X2ApKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiByci5zZXQocHJlZml4LCBpaSk7XG4gICAgICAgIH1cbiAgICB9LCBNYXAoKSlcbn1cblxuLyoqXG4gKiByZXR1cm5zIGEgW3JlZHV4LXRodW5rXSh0aHVuaykgYWN0aW9uIGNyZWF0b3IgdGhhdCB3aWxsIGRpc3BhdGNoIHRoZSB0aHJlZSBzdGF0ZXMgb2Ygb3VyIHJlcXVlc3QgYWN0aW9uLlxuICogZGlzcGF0Y2ggYGZldGNoQWN0aW9uYFxuICogY2FsbCBgc2lkZUVmZmVjdGBcbiAqIHRoZW4gZGlzcGF0Y2ggYHJlY2lldmVBY3Rpb25gXG4gKiBjYXRjaCBkaXNwYXRjaCBgZXJyb3JBY3Rpb25gXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSBhY3Rpb25NYXAgZGVlcCBvYmplY3QgcmVwcmVzZW50YXRpb24gb2YgYXBpIGZ1bmN0aW9uc1xuICogQHJldHVybiB7YXJyYXl9ICAgICAgICAgICAgbGlzdCBvZiBhY3Rpb24gY3JlYXRvcnMgYW5kIGFjdGlvbiB0eXBlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVxdWVzdEFjdGlvblNldChhY3Rpb25NYXApIHtcbiAgICByZXR1cm4gcmVkdWNlQWN0aW9uTWFwKGZyb21KUyhhY3Rpb25NYXApKVxuICAgICAgICAubWFwKChzaWRlRWZmZWN0LCBhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IEZFVENIID0gYCR7YWN0aW9ufV9GRVRDSGA7XG4gICAgICAgICAgICBjb25zdCBSRUNFSVZFID0gYCR7YWN0aW9ufV9SRUNFSVZFYDtcbiAgICAgICAgICAgIGNvbnN0IEVSUk9SID0gYCR7YWN0aW9ufV9FUlJPUmA7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3RBY3Rpb25OYW1lID0gYWN0aW9uXG4gICAgICAgICAgICAgICAgLnNwbGl0KCdfJylcbiAgICAgICAgICAgICAgICAubWFwKHNzID0+IHNzLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXi4vLCBtbSA9PiBtbS50b1VwcGVyQ2FzZSgpKSlcbiAgICAgICAgICAgICAgICAuam9pbignJyk7XG5cbiAgICAgICAgICAgIHJldHVybiBNYXAoKVxuICAgICAgICAgICAgICAgIC5zZXQoYHJlcXVlc3Qke3JlcXVlc3RBY3Rpb25OYW1lfWAsIGNyZWF0ZVJlcXVlc3RBY3Rpb24oRkVUQ0gsIFJFQ0VJVkUsIEVSUk9SLCBzaWRlRWZmZWN0KSlcbiAgICAgICAgICAgICAgICAuc2V0KEZFVENILCBGRVRDSClcbiAgICAgICAgICAgICAgICAuc2V0KFJFQ0VJVkUsIFJFQ0VJVkUpXG4gICAgICAgICAgICAgICAgLnNldChFUlJPUiwgRVJST1IpO1xuXG4gICAgICAgIH0pXG4gICAgICAgIC5mbGF0dGVuKDEpXG4gICAgICAgIC50b0pTKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXF1ZXN0QWN0aW9uKGZldGNoQWN0aW9uLCByZWNpZXZlQWN0aW9uLCBlcnJvckFjdGlvbiwgc2lkZUVmZmVjdCkge1xuICAgIGZ1bmN0aW9uIGFjdGlvbihhYSkge1xuICAgICAgICByZXR1cm4gY3JlYXRlQWN0aW9uKGFhLCAocGF5bG9hZCkgPT4gcGF5bG9hZCwgKHBheWxvYWQsIG1ldGEpID0+IG1ldGEpXG4gICAgfVxuICAgIHJldHVybiAocmVxdWVzdFBheWxvYWQsIG1ldGEgPSB7fSkgPT4gKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xuICAgICAgICB2YXIgc2lkZUVmZmVjdE1ldGEgPSB7XG4gICAgICAgICAgICAuLi5tZXRhLFxuICAgICAgICAgICAgZGlzcGF0Y2gsXG4gICAgICAgICAgICBnZXRTdGF0ZVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGlvbk1ldGEgPSAocmVzdWx0S2V5KSA9PiAoe1xuICAgICAgICAgICAgLi4ubWV0YSxcbiAgICAgICAgICAgIHJlc3VsdEtleTogbWV0YS5yZXN1bHRLZXkgfHwgcmVzdWx0S2V5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRpc3BhdGNoKGFjdGlvbihmZXRjaEFjdGlvbikobnVsbCwge3Jlc3VsdEtleTogbWV0YS5yZXN1bHRLZXkgfHwgZmV0Y2hBY3Rpb259KSk7XG4gICAgICAgIHJldHVybiBzaWRlRWZmZWN0KHJlcXVlc3RQYXlsb2FkLCBzaWRlRWZmZWN0TWV0YSkudGhlbihcbiAgICAgICAgICAgIChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShkaXNwYXRjaChhY3Rpb24ocmVjaWV2ZUFjdGlvbikoZGF0YSwgYWN0aW9uTWV0YShyZWNpZXZlQWN0aW9uKSkpKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkaXNwYXRjaChjcmVhdGVBY3Rpb24oZXJyb3JBY3Rpb24pKGVycm9yLCB7cmVzdWx0S2V5OiBtZXRhLnJlc3VsdEtleSB8fCBlcnJvckFjdGlvbn0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cbn1cbiJdfQ==
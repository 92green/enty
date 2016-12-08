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
                return Promise.reject(dispatch((0, _reduxActions.createAction)(errorAction)(error, { resultKey: meta.resultKey || errorAction })));
            });
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DcmVhdGVSZXF1ZXN0QWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJsb2dSZXF1ZXN0QWN0aW9uTmFtZXMiLCJyZWR1Y2VBY3Rpb25NYXAiLCJjcmVhdGVSZXF1ZXN0QWN0aW9uU2V0IiwiY3JlYXRlUmVxdWVzdEFjdGlvbiIsImFjdGlvbk1hcCIsInByZWZpeCIsImNvbnNvbGUiLCJsb2ciLCJPYmplY3QiLCJrZXlzIiwiam9pbiIsImJyYW5jaCIsInBhcmVudEtleSIsInJlZHVjZSIsInJyIiwiaWkiLCJrZXkiLCJ0b1VwcGVyQ2FzZSIsImlzTWFwIiwibWVyZ2UiLCJzZXQiLCJtYXAiLCJzaWRlRWZmZWN0IiwiYWN0aW9uIiwiRkVUQ0giLCJSRUNFSVZFIiwiRVJST1IiLCJyZXF1ZXN0QWN0aW9uTmFtZSIsInNwbGl0Iiwic3MiLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJtbSIsImZsYXR0ZW4iLCJ0b0pTIiwiZmV0Y2hBY3Rpb24iLCJyZWNpZXZlQWN0aW9uIiwiZXJyb3JBY3Rpb24iLCJhYSIsInBheWxvYWQiLCJtZXRhIiwicmVxdWVzdFBheWxvYWQiLCJkaXNwYXRjaCIsImdldFN0YXRlIiwic2lkZUVmZmVjdE1ldGEiLCJhY3Rpb25NZXRhIiwicmVzdWx0S2V5IiwidGhlbiIsImRhdGEiLCJQcm9taXNlIiwicmVzb2x2ZSIsImVycm9yIiwicmVqZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVFnQkEscUIsR0FBQUEscUI7UUFPQUMsZSxHQUFBQSxlO1FBcUJBQyxzQixHQUFBQSxzQjtRQXVCQUMsbUIsR0FBQUEsbUI7O0FBM0RoQjs7QUFDQTs7QUFFQTs7Ozs7QUFLTyxTQUFTSCxxQkFBVCxDQUErQkksU0FBL0IsRUFBMENDLE1BQTFDLEVBQWtEO0FBQ3JEQyxZQUFRQyxHQUFSLENBQVlDLE9BQU9DLElBQVAsQ0FBWVAsdUJBQXVCRSxTQUF2QixFQUFrQ0MsTUFBbEMsQ0FBWixFQUF1REssSUFBdkQsQ0FBNEQsSUFBNUQsQ0FBWjtB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QVAsRUFBc0JZLElBQXRCLEVBQTRCSCxXQUFXVCxhQUFYLENBQTVCLENBQVQsQ0FBaEIsQ0FBUDtBQUNILGFBSEUsRUFJSCxVQUFDZSxLQUFELEVBQVc7QUFDUCx1QkFBT0YsUUFBUUcsTUFBUixDQUFlVixTQUFTLGdDQUFhTCxXQUFiLEVBQTBCYyxLQUExQixFQUFpQyxFQUFDTCxXQUFXTixLQUFLTSxTQUFMLElBQWtCVCxXQUE5QixFQUFqQyxDQUFULENBQWYsQ0FBUDtBQUNILGFBTkUsQ0FBUDtBQVFILFNBckJNO0FBQUEsS0FBUDtBQXNCSCIsImZpbGUiOiJDcmVhdGVSZXF1ZXN0QWN0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlQWN0aW9ufSBmcm9tICdyZWR1eC1hY3Rpb25zJztcbmltcG9ydCB7ZnJvbUpTLCBNYXB9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbi8qKlxuICogR2l2ZW4gdGhlIHJldHVybiB2YWx1ZSBvZiBjcmVhdFJlcXVlc3RBY3Rpb25TZXQgaXQgd2lsbCBsb2cgdGhlIG5hbWVzIG9mIHRoZSBjcmVhdGVkIGFjdGlvbiB0eXBlcyBhbmQgY3JlYXRvcnNcbiAqIEBwYXJhbSAge29iamVjdH0gYWN0aW9uTWFwIG1hcCBvZiBhY3Rpb25zXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHByZWZpeCAgICBTdHJpbmcgdG8gcHJlZml4IGFjdGlvbnMgdHlwZXMgd2l0aFxuICovXG5leHBvcnQgZnVuY3Rpb24gbG9nUmVxdWVzdEFjdGlvbk5hbWVzKGFjdGlvbk1hcCwgcHJlZml4KSB7XG4gICAgY29uc29sZS5sb2coT2JqZWN0LmtleXMoY3JlYXRlUmVxdWVzdEFjdGlvblNldChhY3Rpb25NYXAsIHByZWZpeCkpLmpvaW4oJ1xcbicpKTtcbn1cblxuLy9cbi8vIFR1cm5zIGEgbmVzdGVkIG9iamVjdCBpbnRvIGEgZmxhdFxuLy8gVVBQRVJfU05BS0UgY2FzZSByZXByZXNlbnRpb25cbmV4cG9ydCBmdW5jdGlvbiByZWR1Y2VBY3Rpb25NYXAoYnJhbmNoLCBwYXJlbnRLZXkgPSAnJykge1xuICAgIHJldHVybiBicmFuY2gucmVkdWNlKChyciwgaWksIGtleSkgPT4ge1xuICAgICAgICB2YXIgcHJlZml4ID0gYCR7cGFyZW50S2V5fSR7a2V5LnRvVXBwZXJDYXNlKCl9YDtcbiAgICAgICAgaWYoTWFwLmlzTWFwKGlpKSkge1xuICAgICAgICAgICAgcmV0dXJuIHJyLm1lcmdlKHJlZHVjZUFjdGlvbk1hcChpaSwgYCR7cHJlZml4fV9gKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcnIuc2V0KHByZWZpeCwgaWkpO1xuICAgICAgICB9XG4gICAgfSwgTWFwKCkpXG59XG5cbi8qKlxuICogcmV0dXJucyBhIFtyZWR1eC10aHVua10odGh1bmspIGFjdGlvbiBjcmVhdG9yIHRoYXQgd2lsbCBkaXNwYXRjaCB0aGUgdGhyZWUgc3RhdGVzIG9mIG91ciByZXF1ZXN0IGFjdGlvbi5cbiAqIGRpc3BhdGNoIGBmZXRjaEFjdGlvbmBcbiAqIGNhbGwgYHNpZGVFZmZlY3RgXG4gKiB0aGVuIGRpc3BhdGNoIGByZWNpZXZlQWN0aW9uYFxuICogY2F0Y2ggZGlzcGF0Y2ggYGVycm9yQWN0aW9uYFxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gYWN0aW9uTWFwIGRlZXAgb2JqZWN0IHJlcHJlc2VudGF0aW9uIG9mIGFwaSBmdW5jdGlvbnNcbiAqIEByZXR1cm4ge2FycmF5fSAgICAgICAgICAgIGxpc3Qgb2YgYWN0aW9uIGNyZWF0b3JzIGFuZCBhY3Rpb24gdHlwZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3RBY3Rpb25TZXQoYWN0aW9uTWFwKSB7XG4gICAgcmV0dXJuIHJlZHVjZUFjdGlvbk1hcChmcm9tSlMoYWN0aW9uTWFwKSlcbiAgICAgICAgLm1hcCgoc2lkZUVmZmVjdCwgYWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBGRVRDSCA9IGAke2FjdGlvbn1fRkVUQ0hgO1xuICAgICAgICAgICAgY29uc3QgUkVDRUlWRSA9IGAke2FjdGlvbn1fUkVDRUlWRWA7XG4gICAgICAgICAgICBjb25zdCBFUlJPUiA9IGAke2FjdGlvbn1fRVJST1JgO1xuXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0QWN0aW9uTmFtZSA9IGFjdGlvblxuICAgICAgICAgICAgICAgIC5zcGxpdCgnXycpXG4gICAgICAgICAgICAgICAgLm1hcChzcyA9PiBzcy50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL14uLywgbW0gPT4gbW0udG9VcHBlckNhc2UoKSkpXG4gICAgICAgICAgICAgICAgLmpvaW4oJycpO1xuXG4gICAgICAgICAgICByZXR1cm4gTWFwKClcbiAgICAgICAgICAgICAgICAuc2V0KGByZXF1ZXN0JHtyZXF1ZXN0QWN0aW9uTmFtZX1gLCBjcmVhdGVSZXF1ZXN0QWN0aW9uKEZFVENILCBSRUNFSVZFLCBFUlJPUiwgc2lkZUVmZmVjdCkpXG4gICAgICAgICAgICAgICAgLnNldChGRVRDSCwgRkVUQ0gpXG4gICAgICAgICAgICAgICAgLnNldChSRUNFSVZFLCBSRUNFSVZFKVxuICAgICAgICAgICAgICAgIC5zZXQoRVJST1IsIEVSUk9SKTtcblxuICAgICAgICB9KVxuICAgICAgICAuZmxhdHRlbigxKVxuICAgICAgICAudG9KUygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmVxdWVzdEFjdGlvbihmZXRjaEFjdGlvbiwgcmVjaWV2ZUFjdGlvbiwgZXJyb3JBY3Rpb24sIHNpZGVFZmZlY3QpIHtcbiAgICBmdW5jdGlvbiBhY3Rpb24oYWEpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUFjdGlvbihhYSwgKHBheWxvYWQpID0+IHBheWxvYWQsIChwYXlsb2FkLCBtZXRhKSA9PiBtZXRhKVxuICAgIH1cbiAgICByZXR1cm4gKHJlcXVlc3RQYXlsb2FkLCBtZXRhID0ge30pID0+IChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcbiAgICAgICAgdmFyIHNpZGVFZmZlY3RNZXRhID0ge1xuICAgICAgICAgICAgLi4ubWV0YSxcbiAgICAgICAgICAgIGRpc3BhdGNoLFxuICAgICAgICAgICAgZ2V0U3RhdGVcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBhY3Rpb25NZXRhID0gKHJlc3VsdEtleSkgPT4gKHtcbiAgICAgICAgICAgIC4uLm1ldGEsXG4gICAgICAgICAgICByZXN1bHRLZXk6IG1ldGEucmVzdWx0S2V5IHx8IHJlc3VsdEtleVxuICAgICAgICB9KTtcblxuICAgICAgICBkaXNwYXRjaChhY3Rpb24oZmV0Y2hBY3Rpb24pKG51bGwsIHtyZXN1bHRLZXk6IG1ldGEucmVzdWx0S2V5IHx8IGZldGNoQWN0aW9ufSkpO1xuICAgICAgICByZXR1cm4gc2lkZUVmZmVjdChyZXF1ZXN0UGF5bG9hZCwgc2lkZUVmZmVjdE1ldGEpLnRoZW4oXG4gICAgICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZGlzcGF0Y2goYWN0aW9uKHJlY2lldmVBY3Rpb24pKGRhdGEsIGFjdGlvbk1ldGEocmVjaWV2ZUFjdGlvbikpKSlcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZGlzcGF0Y2goY3JlYXRlQWN0aW9uKGVycm9yQWN0aW9uKShlcnJvciwge3Jlc3VsdEtleTogbWV0YS5yZXN1bHRLZXkgfHwgZXJyb3JBY3Rpb259KSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxufVxuIl19
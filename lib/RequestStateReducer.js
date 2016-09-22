'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = RequestStateReducer;

var _immutable = require('immutable');

var initialState = (0, _immutable.Map)();

/**
 * Keeps fetching and error state in a global redux property "async", which is an immutable.js Map
 * It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
 * Variables are uppercase snakes and match the consts for fetch and error
 * XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
 * XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
 * ^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won't know whether your list is complete or partial without this
 * e.g. state.async.LEARNING_PLAN_FETCH
 *
 * This listens to all actions and tracks the fetching and error states of all in a generic way. Async state data is kept under the `async` key in redux.
 * Fetching state is kept in `state.async.<FETCH_ACTION>` and will either be `true` if the action is currently fetching or a falsey value otherwise. `<FETCH_ACTION>` refers to the name (string) of the fetch action, such as `USER_GET_FETCH`.
 * Error state is kept in `state.async.<ERROR_ACTION>` and will either be an error like `{status: <status code>, message: <message>}`, or `null` otherwise. `<ERROR_ACTION>` refers to the name (string) of the error action, such as `USER_GET_ERROR`.
 * Actions follow a strict naming convention, each ending in either `_FETCH`, `_RECEIVE` or `_ERROR`. This allows the AsyncStateReducer to listen to the various actions and keep track of async state.
 *
 * @exports RequestStateReducer
 * @type {reducer}
 */
function RequestStateReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var _ref = arguments[1];
	var type = _ref.type;
	var payload = _ref.payload;


	if (!type) {
		return state;
	}

	var actionName = type.replace(/(_FETCH|_ERROR|_RECEIVE)$/g, '');

	if (/_FETCH$/g.test(type)) {
		return state.set(actionName + '_FETCH', true).set(actionName + '_ERROR', null);
	}

	if (/_ERROR$/g.test(type)) {
		var status = payload.status;
		var message = payload.message;

		return state.set(actionName + '_FETCH', false).set(actionName + '_ERROR', {
			status: status,
			message: message
		});
	}

	if (/_RECEIVE$/g.test(type)) {
		return state.set(actionName + '_FETCH', false).set(actionName + '_ERROR', null);
	}

	return state;
}
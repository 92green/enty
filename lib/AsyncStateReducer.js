'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = AsyncStateReducer;

var _immutable = require('immutable');

var initialState = (0, _immutable.Map)();

//
// AsyncStateReducer
//
// Keeps fetching and error state in a global redux property "async", which is an immutable.js Map
// It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
// Variables are uppercase snakes and match the consts for fetch and error
// XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
// XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
// ^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won't know whether your list is complete or partial without this
//
// e.g. state.async.LEARNING_PLAN_FETCH
//

function AsyncStateReducer() {
	var state = arguments.length <= 0 || arguments[0] === undefined ? initialState : arguments[0];
	var action = arguments[1];
	var type = action.type;


	if (!type) {
		return state;
	}

	var actionName = type.replace(/(_FETCH|_ERROR|_RECEIVE)$/g, '');

	if (/_FETCH$/g.test(type)) {
		return state.set(actionName + '_FETCH', true).set(actionName + '_ERROR', null);
	}

	if (/_ERROR$/g.test(type)) {
		var _action$payload = action.payload;
		var status = _action$payload.status;
		var message = _action$payload.message;

		return state.set(actionName + '_FETCH', false).set(actionName + '_ERROR', { status: status, message: message });
	}

	if (/_RECEIVE$/g.test(type)) {
		return state.set(actionName + '_FETCH', false).set(actionName + '_ERROR', null);
	}

	return state;
}
# redux-blueflag
An opinionated set of redux tools to cut down of boilerplate


```sh
npm install --save redux-blueflag
```

## API

### Action Creator Creators
* createEntityReducer
* createRequestAction
* createRequestActionSet

### Reducers
* RequestStateReducer

### Selectors
* selectEntity
* selectEntityByPath
* selectRequestState

### Misc
* logRequestActionNames


## createEntityReducer
```
createEntityReducer(schemaMap: object<ActionType, schema>, constructor?: function) : EntityReducer
```
Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.


```js
import {createEntityReducer} from 'redux-blueflag';
import EntitySchema from 'myapp/EntitySchema';

export default combineReducers({
    entity: createEntityReducer({
		GRAPHQL_RECEIVE: EntitySchema,
        MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSceham
    }),
});
```

## createRequestAction
```
createRequestAction(fetchAction: string, recieveAction: string, errorAction: string, sideEffect: Promise) : RequestActionCreator
```
returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.

* dispatch `fetchAction`
* call `sideEffect`
* then dispatch `recieveAction`
* catch dispatch `errorAction`


## createRequestActionSet
```
createRequestActionSet(actionMap: object): object
```
Deeply flattens the keys of `actionMap` and uses each pf them to create three action types
and one `RequestActionCreator`


```js
import {createRequestActionSet} from 'redux-blueflag';

createRequestActionSet({
    user: {
        get: xhr.get('/user')
    },
    course: {
        post: xhr.post('/course')
    }
});
/*
{
    USER_GET_FETCH: 'USER_GET_FETCH',
    USER_GET_RECIEVE: 'USER_GET_RECIEVE',
    USER_GET_ERROR: 'USER_GET_ERROR',
    COURSE_POST_FETCH: 'COURSE_POST_FETCH',
    COURSE_POST_RECIEVE: 'COURSE_POST_RECIEVE',
    COURSE_POST_ERROR: 'COURSE_POST_ERROR',
    requestUserGet: RequestActionCreator,
    requestCoursePost: RequestActionCreator
}
*/
```

## `LogRequestActionNames(actionMap<object>)`

## `AsyncStateReducer`

This listens to all actions and tracks the fetching and error states of all in a generic way. Async state data is kept under the `async` key in redux.

Fetching state is kept in `state.async.<FETCH_ACTION>` and will either be `true` if the action is currently fetching or a falsey value otherwise. `<FETCH_ACTION>` refers to the name (string) of the fetch action, such as `USER_GET_FETCH`.

Error state is kept in `state.async.<ERROR_ACTION>` and will either be an error like `{status: <status code>, message: <message>}`, or `null` otherwise. `<ERROR_ACTION>` refers to the name (string) of the error action, such as `USER_GET_ERROR`.

Actions follow a strict naming convention, each ending in either `_FETCH`, `_RECEIVE` or `_ERROR`. This allows the AsyncStateReducer to listen to the various actions and keep track of async state.

## `createAction`

[redux-actions] createAction

```js
import {createAction} from 'redux-blueflag';
const fetchData = createAction('FETCH_DATA');
```

## `thunk`

[redux-thunk] thunk

```js
import {applyMiddleware} from 'redux';
import {thunk} from 'redux-blueflag';

const middleware = applyMiddleware(thunk);
```

[redux-actions]: https://github.com/acdlite/redux-actions
[redux-thunk]: https://github.com/gaearon/redux-thunk

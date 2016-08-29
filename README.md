# redux-blueflag
An opinionated set of redux tools to cut down of boilerplate


```sh
npm install --save redux-blueflag
```

```js
import {CreateRequestActionSet} from 'redux-blueflag';

const api = {
    user: {
        get: xhr.get('/user')
    },
    course: {
        get: xhr.get('/course')
    }
}

module.exports = CreateRequestActionSet(api);
/* 
{
    USER_GET_FETCH: 'USER_GET_FETCH',
    USER_GET_RECIEVE: 'USER_GET_RECIEVE',
    USER_GET_ERROR: 'USER_GET_ERROR',
    COURSE_GET_FETCH: 'COURSE_GET_FETCH',
    COURSE_GET_RECIEVE: 'COURSE_GET_RECIEVE',
    COURSE_GET_ERROR: 'COURSE_GET_ERROR',
    requestUserGet: thunkedActionCreator,
    requestCoureGet: thunkedActionCreator    
}
*/
```



## `function CreateRequestAction(fetchAction<string>, recieveAction<string>, errorAction<string>, sideEffect<promise>) : RequestActionCreator`
returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.

* dispatch `fetchAction`
* call `sideEffect`
* then dispatch `recieveAction`
* catch dispatch `errorAction`


## `function CreateRequestActionSet(actionMap<object>)`
Deeply flattens the keys of `actionMap` and uses each pf them to create three action types
and one `RequestActionCreator`


```js
import {CreateRequestActionSet} from 'redux-blueflag';

CreateRequestActionSet({
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

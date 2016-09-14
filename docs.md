## Modules

<dl>
<dt><a href="#module_createEntityReducer">createEntityReducer</a></dt>
<dd><p>Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in <code>schemaMap</code> the payload is normalized based off the given schema.</p>
<pre><code class="language-javascript">import {createEntityReducer} from &#39;redux-blueflag&#39;;
import EntitySchema from &#39;myapp/EntitySchema&#39;;

export default combineReducers({
    entity: createEntityReducer({
        GRAPHQL_RECEIVE: EntitySchema,
        MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSceham
    }),
});
</code></pre>
</dd>
<dt><a href="#module_RequestStateReducer">RequestStateReducer</a> : <code>reducer</code></dt>
<dd><p>Keeps fetching and error state in a global redux property &quot;async&quot;, which is an immutable.js Map
It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
Variables are uppercase snakes and match the consts for fetch and error
XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won&#39;t know whether your list is complete or partial without this
e.g. state.async.LEARNING_PLAN_FETCH</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#createRequestActionSet">createRequestActionSet(actionMap)</a> ⇒ <code>array</code></dt>
<dd><p>returns a <a href="thunk">redux-thunk</a> action creator that will dispatch the three states of our request action.
dispatch <code>fetchAction</code>
call <code>sideEffect</code>
then dispatch <code>recieveAction</code>
catch dispatch <code>errorAction</code></p>
</dd>
</dl>

<a name="module_createEntityReducer"></a>

## createEntityReducer
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


| Param | Type | Description |
| --- | --- | --- |
| schemaMap | <code>object</code> | Map of schema action names. |
| constructor | <code>function</code> | constructor function to edit payload data before it is normalized. |

<a name="module_RequestStateReducer"></a>

## RequestStateReducer : <code>reducer</code>
Keeps fetching and error state in a global redux property "async", which is an immutable.js Map
It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
Variables are uppercase snakes and match the consts for fetch and error
XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won't know whether your list is complete or partial without this
e.g. state.async.LEARNING_PLAN_FETCH

<a name="createRequestActionSet"></a>

## createRequestActionSet(actionMap) ⇒ <code>array</code>
returns a [redux-thunk](thunk) action creator that will dispatch the three states of our request action.
dispatch `fetchAction`
call `sideEffect`
then dispatch `recieveAction`
catch dispatch `errorAction`

**Kind**: global function  
**Returns**: <code>array</code> - list of action creators and action types  

| Param | Type | Description |
| --- | --- | --- |
| actionMap | <code>object</code> | deep object representation of api functions |


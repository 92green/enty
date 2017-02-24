# enty

Redux Blue Flag is a complete [Redux] setup for asynchronous data calls that uses [Normalizr] schemas to handle all client side data management.

# Benefits

```jsx
export default entitiyQuery(props => `
    query {
        characters {
            name
            age
            race
        }
    }
`)(({characters}) => {
    return <ul>{characters.map(({name, age, race}, key) => {
        return <li key={key}>
            <div>{name}</div>
            <div>{age}</div>
            <div>{race}</div>
        </li>;
    })}</ul>
})
```

## Install

```
npm install --save enty
```

## Index
* Creators
    * createEntityReducer
    * createEntityProvider????
    * createEntityQuery
    * createRequestAction
    * createRequestActionSet
    * createSchema ??
* Selectors
    * selectEntity
    * selectEntityByPath
    * selectRequestState
* Hocks (Higher Order Components)
    * PropChangeHock
    * LocalStateHock
* Misc
    * connectWithQuery
    * logRequestActionNames


[Redux]: https://github.com/reactjs/redux
[Normalizr]: https://github.com/paularmstrong/normalizr

## Modules

<dl>
<dt><a href="#module_createEntityReducer">createEntityReducer</a></dt>
<dd><p>Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in <code>schemaMap</code> the payload is normalized based off the given schema.
Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called <code>mainSchema</code> returns a reducer that holds the main entity state.</p>
<pre><code class="language-javascript">import {createEntityReducer} from &#39;enty&#39;;
import EntitySchema from &#39;myapp/EntitySchema&#39;;

export default combineReducers({
    entity: createEntityReducer({
        GRAPHQL_RECEIVE: EntitySchema,
        MY_CUSTOM_ACTION_RECEIVE: EntitySchema.myCustomActionSceham
    }),
});
</code></pre>
</dd>
<dt><a href="#module_LocalStateHock">LocalStateHock</a> ⇒ <code>function</code></dt>
<dd><p><code>LocalStateHock(reducer: function(state, action)) =&gt; function(component: Component)</code>
Wraps a component with a tiny implementation of the redux concept. Takes a reducer and returns a function ready to call with a component. The hock gives the component <code>props.localDispatch</code>which triggers the reducer. the return state of the reducer is then destructured on to the components as props.</p>
</dd>
<dt><a href="#module_PropChangeHock">PropChangeHock</a> ⇒ <code>function</code></dt>
<dd><pre><code class="language-javascript">PropChangeHock(propKeys: [String], sideEffect: function) =&gt; (component: Component) =&gt; Component
</code></pre>
<p>The prop change hock takes a side effect and an array of prop keys paths.
The component then listens for component mount and receive props.
If any of the provided props change the side effect is triggered.</p>
</dd>
<dt><a href="#module_RequestStateReducer">RequestStateReducer</a> : <code>reducer</code></dt>
<dd><p>Keeps fetching and error state in a global redux property &quot;async&quot;, which is an immutable.js Map
It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
Variables are uppercase snakes and match the consts for fetch and error
XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won&#39;t know whether your list is complete or partial without this
e.g. state.async.LEARNING_PLAN_FETCH</p>
<p>This listens to all actions and tracks the fetching and error states of all in a generic way. Async state data is kept under the <code>async</code> key in redux.
Fetching state is kept in <code>state.async.&lt;FETCH_ACTION&gt;</code> and will either be <code>true</code> if the action is currently fetching or a falsey value otherwise. <code>&lt;FETCH_ACTION&gt;</code> refers to the name (string) of the fetch action, such as <code>USER_GET_FETCH</code>.
Error state is kept in <code>state.async.&lt;ERROR_ACTION&gt;</code> and will either be an error like <code>{status: &lt;status code&gt;, message: &lt;message&gt;}</code>, or <code>null</code> otherwise. <code>&lt;ERROR_ACTION&gt;</code> refers to the name (string) of the error action, such as <code>USER_GET_ERROR</code>.
Actions follow a strict naming convention, each ending in either <code>_FETCH</code>, <code>_RECEIVE</code> or <code>_ERROR</code>. This allows the AsyncStateReducer to listen to the various actions and keep track of async state.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#entityQuery">entityQuery(sideEffect)</a> ⇒ <code>function</code></dt>
<dd><p>Takes an action creator and gives it a <code>resultKey</code>. wraps it in PropChangeHock, entitySelect and requestStateSelect</p>
</dd>
<dt><a href="#logRequestActionNames">logRequestActionNames(actionMap, prefix)</a></dt>
<dd><p>Given the return value of creatRequestActionSet it will log the names of the created action types and creators</p>
</dd>
<dt><a href="#createRequestActionSet">createRequestActionSet(actionMap)</a> ⇒ <code>array</code></dt>
<dd><p>returns a <a href="thunk">redux-thunk</a> action creator that will dispatch the three states of our request action.
dispatch <code>fetchAction</code>
call <code>sideEffect</code>
then dispatch <code>recieveAction</code>
catch dispatch <code>errorAction</code></p>
</dd>
<dt><a href="#selectEntity">selectEntity(state, resultKey, [schemaKey])</a> ⇒ <code>object</code></dt>
<dd><p>The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.</p>
</dd>
<dt><a href="#selectEntityByPath">selectEntityByPath(state, path, [schemaKey])</a> ⇒ <code>object</code></dt>
<dd><p>Given a path to entity state it will return the denormalized state.
This function is only used when you are certain you need the exact id in entity state.
Most often the request key is more appropriate.</p>
</dd>
<dt><a href="#selectRequestState">selectRequestState(state, actions)</a> ⇒ <code>object</code></dt>
<dd><p>Returns the state of a current request. Either fetching, error or not yet requested.</p>
</dd>
</dl>

<a name="module_createEntityReducer"></a>

## createEntityReducer
Returns a reducer that normalizes data based on the [normalizr] schemas provided. When an action is fired, if the type matches one provied in `schemaMap` the payload is normalized based off the given schema.
Takes a map of schemas where each key is an action name and value is a schema. must have at least one key called `mainSchema` returns a reducer that holds the main entity state.
```js
import {createEntityReducer} from 'enty';
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

<a name="module_LocalStateHock"></a>

## LocalStateHock ⇒ <code>function</code>
`LocalStateHock(reducer: function(state, action)) => function(component: Component)`
Wraps a component with a tiny implementation of the redux concept. Takes a reducer and returns a function ready to call with a component. The hock gives the component `props.localDispatch`which triggers the reducer. the return state of the reducer is then destructured on to the components as props.

**Returns**: <code>function</code> - componentCreator    function to pass react component  

| Param | Type | Description |
| --- | --- | --- |
| reducer | <code>function</code> | a function that acts as a local reducer |

<a name="module_PropChangeHock"></a>

## PropChangeHock ⇒ <code>function</code>
```js
PropChangeHock(propKeys: [String], sideEffect: function) => (component: Component) => Component
```
The prop change hock takes a side effect and an array of prop keys paths.
The component then listens for component mount and receive props.
If any of the provided props change the side effect is triggered.

**Returns**: <code>function</code> - componentCreator    function to pass react component  

| Param | Type | Description |
| --- | --- | --- |
| propKeys | <code>Array</code> | list of strings of prop keys |
| outputFunction | <code>function</code> |  |

<a name="module_RequestStateReducer"></a>

## RequestStateReducer : <code>reducer</code>
Keeps fetching and error state in a global redux property "async", which is an immutable.js Map
It tracks state on actions ending with _FETCH, _ERROR or _RECEIVE
Variables are uppercase snakes and match the consts for fetch and error
XXX_FETCH is a boolean indicating if that action is currently requesting info (or undefined before any actions have been dispatched)
XXX_ERROR is either { status, message } if an error has occured, or is null otherwise
^ really only useful for ensuring that a complete list of objects has been received when using ordered maps for collections. You won't know whether your list is complete or partial without this
e.g. state.async.LEARNING_PLAN_FETCH

This listens to all actions and tracks the fetching and error states of all in a generic way. Async state data is kept under the `async` key in redux.
Fetching state is kept in `state.async.<FETCH_ACTION>` and will either be `true` if the action is currently fetching or a falsey value otherwise. `<FETCH_ACTION>` refers to the name (string) of the fetch action, such as `USER_GET_FETCH`.
Error state is kept in `state.async.<ERROR_ACTION>` and will either be an error like `{status: <status code>, message: <message>}`, or `null` otherwise. `<ERROR_ACTION>` refers to the name (string) of the error action, such as `USER_GET_ERROR`.
Actions follow a strict naming convention, each ending in either `_FETCH`, `_RECEIVE` or `_ERROR`. This allows the AsyncStateReducer to listen to the various actions and keep track of async state.

<a name="entityQuery"></a>

## entityQuery(sideEffect) ⇒ <code>function</code>
Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect

**Kind**: global function  
**Returns**: <code>function</code> - action creator  

| Param | Type |
| --- | --- |
| sideEffect | <code>function</code> | 

<a name="logRequestActionNames"></a>

## logRequestActionNames(actionMap, prefix)
Given the return value of creatRequestActionSet it will log the names of the created action types and creators

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| actionMap | <code>object</code> | map of actions |
| prefix | <code>string</code> | String to prefix actions types with |

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

<a name="selectEntity"></a>

## selectEntity(state, resultKey, [schemaKey]) ⇒ <code>object</code>
The primary means of accessing entity state. Given a requestKey it will return the denormalized state object.

**Kind**: global function  
**Returns**: <code>object</code> - entity map  

| Param | Type | Default |
| --- | --- | --- |
| state | <code>object</code> |  | 
| resultKey | <code>string</code> |  | 
| [schemaKey] | <code>string</code> | <code>&quot;mainSchema&quot;</code> | 

<a name="selectEntityByPath"></a>

## selectEntityByPath(state, path, [schemaKey]) ⇒ <code>object</code>
Given a path to entity state it will return the denormalized state.
This function is only used when you are certain you need the exact id in entity state.
Most often the request key is more appropriate.

**Kind**: global function  
**Returns**: <code>object</code> - entity map  

| Param | Type | Default |
| --- | --- | --- |
| state | <code>object</code> |  | 
| path | <code>array</code> |  | 
| [schemaKey] | <code>string</code> | <code>&quot;mainSchema&quot;</code> | 

<a name="selectRequestState"></a>

## selectRequestState(state, actions) ⇒ <code>object</code>
Returns the state of a current request. Either fetching, error or not yet requested.

**Kind**: global function  
**Returns**: <code>object</code> - the curerent request state  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>object</code> | the current state |
| actions | <code>string</code> &#124; <code>array</code> | either one or many partial action types |



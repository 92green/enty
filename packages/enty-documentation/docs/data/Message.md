---
id: Message
title: Message
---

A Message bundles up all of the information surrounding a request and response from the api.
It holds all the information that you would need to both make requests and render their responses
when they come back. _Most often you shouldn't need to worry about creating messages. They are constructed for you
by the RequestHock._

```js
class Message<RequestState> {
    response: *,
    requestState: RequestState,
    requestError: *,
    onRequest(response: *) => Promise<*>
    get()
    getIn()
    updateRequestState()
}
```

## Properties

### .response
**type:** `*`  

Once a request has returned the data can be found in response. _Note: you can also use
[get()](#get) and [getIn()](#getin) for easy access to the response object._

### .requestState
**type:** [RequestState]

Holds a variant that represents the current state of the request. By using a variant
Enty lets you declaratively represent how your component should render under each state of the 
request. _See [RequestState] for more details on variants._

```jsx
function UserAvatar(props) {
    const {userMessage} = props;
    return userMessage.requestState
        .fetchingMap(() => <Loader/>)
        .refetchingMap(() => <Loader/>)
        .successMap(() => <img src={userMessage.get('avatar')} />)
        .errorMap={() => <span>user not found :(</span>}
        .value();
}
```

### .requestError
**type:** `*`  

If the request promise rejects Enty will rerender the view with the caught error in 
`requestError`. _The requestState will also be in an error state._

```jsx
function UserAvatar(props) {
    const {userMessage} = props;
    return userMessage.requestState
        .successMap(() => <img src={userMessage.get('avatar')} />)
        .errorMap={() => <span>{userMessage.requestError.message}</span>}
        .value();
}
```


## Methods

### .onRequest()
**type:** `(payload) => Promise<*>`  

A promise returning function that will dispatch the corresponding api function. _This ismost often 
used to trigger user initiated requests like save or remove._

```jsx
function Button({message}) {
    return <button onClick={() => message.onRequest()}>Save</button>;
}

const SaveUserButton = SaveUserHoc({name: 'message'})(Button);
```


### .get()
**type:** `(key: string, defaultValue?: *) => *`  

Returns the value from `message.response.${key}`. If nothing is found it will return `defaultValue`
if provided.

```js
const score = message.get('score', 0);
```

### .getIn()
**type:** `(keyPath: Array<string>, defaultValue?: *) => *`  

Returns the value at the provided key pathm or defaultValue if nothing is found.

```js
const name = message.getIn(['user', 'name'], '-');
```

### .updateRequestState()
**type:** `(updater: RequestState => RequestState) => Message`  

Update the requestState via a function. Allows the user to change a request state and pass the 
message on. _Can be used to force the rendering of a specific branch._

```js
message.updateRequestState(requestState => requestState.toError());
```



## Unit Functions
Enty provides a series of helper functions to let you construct messages
in various request states. These are mostly used for providing default states.

### EmptyMessage()
**type:** `(MessageProps = {}) => Message<EmptyState>`

Create a Message in an Empty state.

### FetchingMessage()
**type:** `(MessageProps = {}) => Message<FetchingState>`

Create a message in a Fetching state

### RefetchingMessage()
**type:** `(response: *, rest?: MessageProps = {}) => Message<RefetchingState>`

Create a message in a Refetching state

### SuccessMessage()
**type:** `(response: *, rest?: MessageProps = {}) => Message<SuccessState>`

Create a message in a Success state


### ErrorMessage()
**type:** `(requestError: *, rest?: MessageProps = {}) => Message<ErrorState>`

Create a message in an Error state.


[RequestState]: ./request-state

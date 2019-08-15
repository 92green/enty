---
title: useRequest
group: React Enty
---

The useRequest hook is the way api functions are bound to your components.

When a component is wrapped with a RequestHoc it will be given a [Message] object that contains all 
the necessary tools to request data and render something when it comes back. The hoc handles the 
normalizing and denormalizing of the data so that you only need to worry about what data you want 
and when you want to ask for it.

```flow
RequestHock({
    name: string
    auto?: boolean|Array<string>,
    mapResponseToProps?: boolean|(response) => newProps,
    optimistic?: boolean,
    payloadCreator?: (props: *) => *,
    shouldComponentAutoRequest?: (props: *) => boolean,
    updateResultKey?: (resultKey: string, props: *) => string
})(Component);
```


## Config

### config.name
**type:** `string`  
**required:** `true`  

The name of the prop to pass the [Message] down through.

```js
const withUser = UserGetHoc({name: 'userMessage'});
```

### config.auto
**type:** `boolean|Array<string>`  

Automatically request data on component mount or if a prop changes.

If `config.auto` is set to true the api function will be called immediately whenever the component mounts.
This is useful for upfront fetching of a pages data.

If `config.auto` is set to an array of strings that match to prop names the api function will be called 
immediately on component mount, and everytime one of those props changes.
This is useful for fetching data in a component that changes often.

If `config.auto` is not declared nothing will happen until the `onRequest` callback is fired.
This is useful for mutations triggered by user interaction like save, update or delete.

```js
// Request the user on component mount
UserGetHoc({
    name: 'userMessage', 
    auto: true
});

// Request the user on component mount and when the userId prop changes
UserGetHoc({
    name: 'userMessage',
    auto: ['userId']
});
```


### config.payloadCreator
**type:** `(props|payload) => *`  

The payload creator is used to generate a unique key to keep track of your requests. The result is 
hashed and stored in Enty state. This means a single RequestHoc can query different types of the 
same data and Enty is able to cache the results.

* If `auto` is truthy props are passed through `mapPropsToPayload` and then into `payloadCreator`.
* Calls to `message.onRequest` are passed directly to `payloadCreator`.


```js
// Auto request different users from react router params
UserGetHoc({
    name: 'userMessage', 
    auto: ['match.params.id'],
    payloadCreator: (props) => ({
        id: props.match.params.id
    })
});
```

### config.mapPropsToPayload
**type:** `(props: Object) => Object`

If `config.auto` is truthy `mapPropsToPayload` is called on props before they are passed to the 
payload creator. This is useful in situations where you are both automatically requesting data 
and triggering the `onRequest` callback as the payload creator does not need to mimic the props 
object.

```jsx
// Request the user on component mount based on props.userId
UserGetHoc({
    name: 'userMessage',
    auto: ['userId'],
    mapPropsToPayload: (props) => props.userId,
    payloadCreator: (id) => ({query: {user: id}}
})

// in another component request the user based on props.id and props.userMessage
function RefreshUserButton(props) {
    const {id, userMessage} = props;
    return <button onClick={() => userMessage.onRequest(id)}>Refresh</button>;
}
```


### config.mapResponseToProps
**type:** `boolean|(response) => newProps`  

Function to map response back and then spread it back onto props.
Useful for when you don't wish to fish the response out of the request message.


### config.optimistic
**type:** `boolean`
**default:** `true`

If true the request hoc will return any existing data it has for the current request
during the empty, fetching and refetching states.


### config.shouldComponentAutoRequest
**type:** `(props) => boolean`  

If auto requesting is enabled, this hook lets you cancel the request based on props.


### config.updateResultKey
**type:** `boolean|Array<string>`  

Thunk to amend the result key based on props, used when you only have one instance of hock,
but it is invoked in various ways.

```js
// Update based on an id
UserGetHoc({
    name: 'userMessage',
    updateResultKey: (resultKey, props) => `${resultKey}-${props.id}`
});

// Create a fixed resuly key.
UserGetHoc({
    name: 'userMessage',
    updateResultKey: () => 'USER_GET_HOC'
});
```





## Examples
### Fetch On Load
### Error On Load
### Nothing
### Refetch
### Fetch On Prop Change
### Fetch On Callback
### Fetch Series
### Fetch Parallel



[Message]: /docs/data/Message


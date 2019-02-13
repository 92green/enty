---
id: RequestHoc
title: Request Hoc
---

Request Hoc's are the way api functions are bound to your components.

When a component is wrapped with a RequestHoc it will be given a [Message] object that contains all 
the necessary tools to request data and render something when it comes back. The hoc handles the 
normalizing and denormalizing of the data so that you only need to worry about what data you want 
and when you want to ask for it.

```flow
RequestHock({
    name: string
    auto?: boolean|Array<string>,
    shouldComponentAutoRequest?: (props: *) => boolean,
    payloadCreator?: (props: *) => *,
    pipe?: (props: *) => (message: Message) => Message,
    updateResultKey?: (resultKey: string, props: *) => string,
    resultKey?: string,
    mapResponseToProps?: boolean|(response) => newProps
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
If true, request data on the first render if array of strings, request on the first render and each 
time one of these props change.

```js
// Request the user on component mount
UserGetHoc({
    name: 'userMessage', 
    auto: true
});

// Request the user on component mount and when the userId prop changes
UserGetHoc({
    name: 'userMessage',
    auth: ['userId']
});
```



### config.payloadCreator
**type:** `(props|payload) => *`  

Map your props to the api function payload. If auto is truthy props will be given to the 
function, otherwise it will be given what is passed to `message.onRequest()`.

```js
// Auto request the user from react router params
UserGetHoc({
    name: 'userMessage', 
    auto: ['props.match.params.id'],
    payloadCreator: (props) => ({
        id: props.match.params.id
    })
});

// Create a save user message that accepts a user object
UserGetHoc({
    name: 'saveUserMessage', 
    payloadCreator: (user: User) => ({
        id: user.id
    })
});
```

### config.shouldComponentAutoRequest
**type:** `(props) => boolean`  

If auto requesting is enabled, this hook lets you cancel the request based on props.


### config.mapResponseToProps
**type:** `boolean|(response) => newProps`  

Function to map response back and then spread it back onto props.
Useful for when you don't wish to fish the response out of the request message.


### config.pipe
**type:** `(props: *) => (message: Message) => Message`  

Double-barrelled function to update the message before it is given
to the child component


### config.updateResultKey
**type:** `boolean|Array<string>`  

Thunk to amend the result key based on props, used when you only have one instance of hock,
but it is invoked in various ways.

```js
// Create a fixed resuly key.
UserGetHoc({
    name: 'userMessage',
    updateResultKey: () => 'USER_GET_HOC'
});
```





## Examples




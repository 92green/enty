---
id: RequestHoc
title: Request Hoc
---

Request Hoc's are the way api functions are bound to your components.

When a component is wrapped with a RequestHoc it will be given a [Message] object that contains all 
the necessary tools to request data and render something when it comes back. The hoc handles the 
normalizing and denormalizing of the data so that you only need to worry about what data you want 
and when you want to ask for it.

```
RequestHock({
    name: string

    // Auto call the request on page load and prop change
    // if true, request on the first render
    // if array of strings, request on the first render and each time one of the props changes
    auto?: boolean|Array<string>,

    // If auto requesting is enabled, this hook lets you cancel the request based on props.
    shouldComponentAutoRequest?: (props: *) => boolean,

    // function to map props to your api payload
    payloadCreator?: (props: *) => *,

    // Double-barrelled function to update the message before it is given
    // to the child component
    pipe?: (props: *) => (message: Message) => Message,

    // thunk to amend the result key based on props, used when you only have one instance of hock,
    // but it is invoked in various ways.
    //
    // @TODO: check how this plays out with request states and propKeys
    updateResultKey?: (resultKey: string, props: *) => string,

    // custom hardcoded resultKey
    resultKey?: string,

    // Function to map response back and then spread it back onto props.
    // Useful for when you don't wish to fish the response out of the request message.
    mapResponseToProps?: boolean|Object => Object
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

### config.payloadCreator
### config.shouldComponentAutoRequest
### config.mapResponseToProps
### config.pipe
### config.updateResultKey

## Props

## Examples




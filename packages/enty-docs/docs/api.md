---
path: /api
date: 2018-09-03
title: API
---

The Enty API provides a standard way to bind your data fetching to your components.
The API lets you declare groups of Promise returning functions, that are then converted to hocs
that hide away all the normalizing and keeping track of request state.

## Api 
The EntityApi function takes an object of promise returning functions and turns them into hocs.
This abstraction is helpful as it creates a barrier between your data fetching code and your views.

* It is declarative
* It is shimmable
* It is shareable
* It is non-prescriptive

```js
const api = EntityApi({
    userItem: variables => fetch('/graphql', {query: serItemQuery, variables}),
    userList: variables => fetch('/graphql', {query: UserListQuery, variables}),

    jobItem: variables => fetch('/graphql', {query: JobItemQuery, variables}),
    jobList: variables => fetch('/graphql', {query: JobListQuery, variables})
});

export UserItemRequestHock = api.UserItemRequestHock;
export UserListRequestHock = api.UserItemRequestHock;
export JobItemRequestHock = api.JobItemRequestHock;
export JobListRequestHock = api.JobItemRequestHock;
```

## Request Hocs
Once you have declared your api you can export the request hocks an apply them to your components.

```
const ProfileView = UserItemRequestHock({
    name: 'userMessage',
    auto: true
});
```

### Automatic or Callback? 
Each request hock can be configured to request automatically or wait for a callback.



### Messages
Each hoc requires a name prop, all the data associated with that request will be stored on that name.
This lets you stack up multiple requests without having to worry about namespace collisions.

#### Message.onRequest
Each message is given an onRequest callback that is bound to the promise in the api.
Calling the onRequest will call the api function and return a promise that will either contain 
the next normalized response or the requests error.

This lets your either trigger multiple actions in parrallel or sequence them together.


#### Message.requestState
One of Enty's core goals is to be a declartive state management library. Because of this Enty uses 
a version of the variant pattern to declare hold the current state of each request.

This pattern lets you delcare upfront what should happen at each state and stops you writing adhoc 
and complicated null/boolean tests to check if your data has arrived.


```jsx
const {requestState} = this.props.userMessage;
const {response} = this.props.userMessage;
const {requestError} = this.props.userMessage;
return requestState
    .fetchingMap(() => <Loader/>)
    .refetchingMap(() => <Loader/>)
    .successMap(() => <div>{response.user.name}</div>)
    .errorMap(() => <Error error={requestError}/>)
    .value();
```

Becuase the request state is a concrete data type, rather than just a series of booleans, it 
is very easy to abstract common loading situations away behind a function or a hoc.

```
const LoadingHoc (config) => (Component) => (props) => {
    const message = this.props[config.message];
    const {requestState} = message;
    const {response} = message;
    const {requestError} = message;

    return requestState
        .fetchingMap(() => <Loader/>)
        .refetchingMap(() => <Loader/>)
        .successMap(() => <Component {...this.props} />)
        .errorMap(() => <Error error={requestError}/>)
        .value();
}
```

You can even use a reduce to combine multiple request states together.
At each iteration if the previous requestState is a success it will replace it with the next.
This means that all must be true for the final state to render.
But if any are fetching or errored we will still get the right state.

```
return this.props[config.messages]
    .reduce((previous, next) => previous.successFlatMap(() => next))
    .fetchingMap(() => <Loader/>)
    .refetchingMap(() => <Loader/>)
    .errorMap(() => <Error error={requestError}/>)
    .successMap(() => <Component {...this.props} />)
    .value();
```

TODO: Request state any successMap example

#### Message.response
When the request is successful the entities matching your request will be avaiable in the messages response.
The response data is stored here rather than props to stop namespace collisions between other messages and hocs.
If this becomes a hassle you can use the `config.mapResponseToProps` to hoist the data out of the message.

```jsx
// Map the whole response object to props
const withData = RequestHoc({
    name: 'userMessage',
    mapResponseToProps: response => response
});

// Map a single prop
const withData = RequestHoc({
    name: 'userMessage',
    mapResponseToProps: response => ({data: response.userItem})
});

```









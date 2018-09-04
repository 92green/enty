---
path: /api
date: 2018-09-03
title: API
---

The Enty API provides a standard way to separate your data fetching code from your views.
The API lets you declare groups of Promise returning functions that are then converted to hocs.

These hocs handle the requesting of data and how that is normalized into state. They then provide your
views with a consitent data stucture that holds both the most up to date version of your request and 
what stage the request cycle is up to. 

This abstraction is helpful as it creates a barrier between your data fetching code and your views.

* It is declarative
* It is shareable
* It is non-prescriptive
* It is shimmable


## Declaring an API
The EntityApi function takes your application schema and an object of promise returning functions 

Below is an example of an api that can fetch both users and jobs from a graphql server.

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

### Sharing
Because the api is declared up front it becomes really easy to split your core api into smaller parts.

```
// UserApi.js

export default {
    userItem: (variables) => fetch('/graphql', {query: UserItemQuery, variables}),
    userList: (variables) => fetch('/graphql', {query: UserListQuery, variables}),
    userCreate: (variables) => fetch('/graphql', {query: UserCreateMutation, variables})
}


// ApplicationApi.js
import UserApi from './UserApi';
import CoffeeApi from './CoffeeApi';
import CatApi from './CatApi';


const Api = EntityApi(ApplicationSchema, {
    ...UserApi,
    ...CoffeeApi,
    ...CatApi
});

```

### Non prescriptive
TODO: Becuase promises are standard you can use any promise returning logic. (RX)

### Api shimming
One of the benefits of declaring your api separate to your views is that it provides a space
to shim data before it enters your app. If an external api can only provide you with data in a certain 
shape you can change it to a shape that makes sense to your entities before entering the [enty flow].

Say you are integrating with a rest endpoint that returns an array of user but because your application 
schema can support multiple types it really makes sense to return an object with the key of `userList`
that contains an array of users.

```
EntityApi(ApplicationSchema, {
    userList: (payload) => fetch('/api/users', payload)
        .then(userList => ({userList}))
});
```

## Request Hocs
Once you have declared your api you can export the request hocks and apply them to your components.

```
const withUser = UserItemRequestHock({
    name: 'userMessage',
    auto: true
});

export default withUser(UserProfile);
```

### Automatic or Callback? 
Each request hock can be configured to request automatically or wait for a callback.

If `config.auto` is set to true the api function will be called immediately whenever the component mounts.
This is useful for upfront fetching of a pages data.

If `config.auto` is set to an array of strings that match to prop names. The api function will be called 
immediately on component mount, and everytime one of those props changes.
This is useful for fetching data in a component that changes often.


If `config.auto` is not declared nothing will happen until the `onRequest` callback is fired.
This is useful for mutations triggered by user interaction like save, update or delete.

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









---
id: api
title: Entity Api
---
_This is an introductory description of the EntityApi. For specific details of
their types and methods check the [Api](/docs/data/EntityApi)._

The EntityApi provides a standard way to separate your data fetching code from your views.
It lets you declare groups of Promise returning functions that are converted to hocs.

These hocs handle when data is requested and it is normalized into state. They then provide your
views with a consitent data stucture that holds both the most up to date version of your requested
data and what stage the request cycle is currently in.

This abstraction is helpful as it creates a barrier between your data fetching code and your views.

* It is declarative
* It is shareable
* It is non-prescriptive
* It is shimmable


## Declaring an API
The EntityApi function takes your application schema and an object of promise returning functions 
Below is an example of an api that can fetch both users and jobs from a graphql server.

```js
import {EntityApi} from 'react-enty';

const api = EntityApi({
    user: {
        item: variables => fetch('/graphql', {query: serItemQuery, variables}),
        list: variables => fetch('/graphql', {query: UserListQuery, variables}),
    },
    job: {
        item: variables => fetch('/graphql', {query: JobItemQuery, variables}),
        list: variables => fetch('/graphql', {query: JobListQuery, variables})
    }
});

export UserItemRequestHock = api.user.item.request;
export UserListRequestHock = api.user.list.request;
export JobItemRequestHock = api.job.item.request;
export JobListRequestHock = api.job.list.request;
```

### Sharing
Because the api is declared up front it becomes really easy to split your core api into smaller parts.

```js
// UserApi.js
export default {
    item: (variables) => fetch('/graphql', {query: UserItemQuery, variables}),
    list: (variables) => fetch('/graphql', {query: UserListQuery, variables}),
    create: (variables) => fetch('/graphql', {query: UserCreateMutation, variables})
}


// ApplicationApi.js
import {EntityApi} from 'react-enty';
import UserApi from './UserApi';
import CoffeeApi from './CoffeeApi';
import CatApi from './CatApi';

const Api = EntityApi(ApplicationSchema, {
    user: UserApi,
    coffee: CoffeeApi,
    cat: CatApi
});

```

### Non prescriptive
TODO: Becuase promises are standard you can use any promise returning logic. (RX)

### Api shimming
One of the benefits of declaring your api separate to your views is that it provides a space
to shim data before it enters your app. If an external api can only provide you with data in a certain 
shape you can change it to a shape that makes sense to your entities before normalizing.

Say you are integrating with a rest endpoint that returns an array of user but because your application 
schema can support multiple types it really makes sense to return an object with the key of `userList`
that contains an array of users.

```js
EntityApi(ApplicationSchema, {
    userList: (payload) => fetch('/api/users', payload)
        .then(userList => ({userList}))
});
```


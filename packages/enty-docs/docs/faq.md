---
path: /faq
date: 2017-11-07
title: FAQ
---


### What if I am using two Query/Mutation hocks
Use the options override!

```js
const withQuery = CoreQueryHock(
    props => ({
        query: UserQuery, 
        variables: {
            id: props.id
        }
    }),
    {
        queryRequestStateProp: 'userRequestState'
    }
);
```


### How do I load things?

### Why is react-redux a peer dependency (it's not yet... but it should be)

### How do I handle endpoints that return arrays?
We have found the cleanest way is to add a new service to your api and modify the data before it is given to Enty

```js
// EntityApi.js
const Api = EntityApi(ApplicationSchema, {
    core: payload => request('/graphql', payload),
    userList: payload => request('/user', payload).then(data => ({userList: data}))
});
```

### Do I have to export an MapSchema from my EntityApi?

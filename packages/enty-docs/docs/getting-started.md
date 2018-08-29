---
path: /getting-started
title: Getting Started
---

## Installation

```
yarn add react-enty
```
_Note: the `enty` package only contains the schemas. `react-enty` contains the api, which lets you use those schemas in a react project.
React Enty depends on Enty, so you only need to add react enty to your project._

## Setup

Enty has two parts: A Schema and an Api.

### 1. Schema
The first step in implementing Enty is to create your schema. This defines the relationships between your entities. 
In this example we'll say a user has a list of friends which are also users. 

```js
// entity/ApplicationSchema.js
import {
    ObjectSchema,
    ArraySchema,
    EntitySchema,
} from 'react-enty';

var user = EntitySchema('user');
var userList = ArraySchema(user);

user.set(ObjectSchema({
    friendList: userList
}))

export default ObjectSchema({
   user,
   userList
});

```
Read more: [Schemas]

### 2. API
The second thing we need to do is to create an api from our schema. This will let us fetch some data.
The EntityApi takes a bunch of promise returning functions and turns them into hocs that fetch, normalize and then provide data to our application. 

```js
// entity/EntityApi.js
import {EntityApi} from 'enty';
import ApplicationSchema from './ApplicationSchema';

const Api = EntityApi(ApplicationSchema, {
    user: variables => request('/graphql', {query: UserQuery, variables}),
    userList: variables => request('/graphql', {query: UserListQuery, variables})
});

export const EntityProvider = Api.EntityProvider;
export const UserRequestHock = Api.UserRequestHock;
export const UserListRequestHock = Api.UserListRequestHock;


```
Read more: [Api]

### 3. Connect to react
Currently Enty uses redux to store it's data. The api we recently created exports a store that
we can dump into a redux provider. 
TODO: enty should export a provider and completely abastract away the store. 
TODO: invesitgate context api / hidden redux pros and cons.

```jsx
// client.jsx
import {React} from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import {EntityStore} from './entity/EntityApi';


ReactDOM.render(
    <Provider store={EntityStore}>
        <App />
    </Provider>,
    document.getElementById('app'),
);

```
Read more: [Redux]


### 4. Make a Request
Now we can use one of the request hocs exported from our api to request data.

```jsx
// component/User.jsx
import {React} from 'react';
import {UserRequestHock} from '../entity/EntityApi';

const withUserData = UserRequestHock({
    name: 'userMessage',
    auto: ['userId'],
    payloadCreator: (props) => ({id: props.userId})
});

function User(props) {
    const {response, requestState, requestError} = props.userMessage;
    return requestState
        .fetchingMap(() => <Loader/>)
        .refetchingMap(() => <Loader/>)
        .errorMap(() => <ErrorMessage error={requestError} />)
        .successMap(() => <img src={response.user.avatar} />)
        .value();
}

export default withUserData(User);

```

Read more: [RequestHock], [Message], [RequestState]

[Schemas]: /Schemas
[Api]: /Api
[Redux]: /Redux
[RequestHock]: /RequestHock
[Message]: /Message
[RequestState]: /RequestState


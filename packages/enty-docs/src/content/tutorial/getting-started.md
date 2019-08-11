---
id: getting-started
title: Getting Started
group: Tutorials
---

## Installation

```
yarn add react-enty
```
_Note: the `enty` package only contains the schemas. `react-enty` contains the api, which lets you 
use those schemas in a react project. React Enty depends on Enty, so you only need to add react 
enty to your project._

## Setup

When using Enty in a project there are two parts: The schema and the API.

### 1. Schema
The first step in implementing Enty is to create your schema. This defines the relationships between
your entities.  In this example we'll say a user has a list of friends which are also users. 

```js
// ApplicationSchema.js
import {ObjectSchema} from 'react-enty';
import {ArraySchema} from 'react-enty';
import {EntitySchema} from 'react-enty';

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

```jsx
// entity/EntityApi.js
import {EntityApi} from 'react-enty';
import ApplicationSchema from './ApplicationSchema';

const Api = EntityApi(ApplicationSchema, {
    user: {
        get: variables => request('/graphql', {query: UserQuery, variables}),
        list: variables => request('/graphql', {query: UserListQuery, variables})
    }
});

export const EntityProvider = Api.EntityProvider;
export const UserRequestHock = Api.user.get.request;
export const UserListRequestHock = Api.user.list.request;


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
import ReactDOM from 'react-dom';
import {EntityProvider} from './entity/EntityApi';


ReactDOM.render(
    <EntityProvider>
        <App />
    </EntityProvider>,
    document.getElementById('app'),
);

```


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
        .errorMap(() => <Message.error error={requestError} />)
        .successMap(() => <img src={response.user.avatar} />)
        .value();
}

export default withUserData(User);

```

Read more: [RequestHoc], [Message], [RequestState]

[Schemas]: /docs/schemas/entity-schema
[Api]: /docs/api
[RequestHoc]: /docs/data/RequestHoc
[Message]: /docs/data/Message
[RequestState]: /docs/data/RequestState


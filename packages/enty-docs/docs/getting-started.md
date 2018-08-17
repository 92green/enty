---
path: /getting-started
title: Getting Started
---

Enty has two parts: A Schema and an Api.

### 1. Schema
The first step in implementing Enty is to define your schema. This defines what relationships your entities have. A user might have a list of friends which are also users. So we can define that as a user

```js
// entity/ApplicationSchema.js
import {
    MapSchema,
    ListSchema,
    EntitySchema,
} from 'enty';

var user = EntitySchema('user');
var userList = ListSchema(user);

user.set(MapSchema({
    friendList: userList
}))

export default MapSchema({
   user,
   userList
});

```

### 2. API
The second thing we need to do is to create an api from our schema. This will let us fetch some data.

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

### 3. Connect to react

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

### 4. Make a Request

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



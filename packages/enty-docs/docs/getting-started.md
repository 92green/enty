---
path: /getting-started
title: Getting Started
---

Enty has two parts: A Schema and an EntityApi.

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
The second thing we need to do is to create our EntityApi from our schema;

```js
// entity/EntityApi.js
import {EntityApi} from 'enty';
import ApplicationSchema from './ApplicationSchema';

const Api = EntityApi(ApplicationSchema, {
    core: payload => request('/graphql', payload)
});

export const {
    EntityStore,
    CoreQueryHock,
    CoreMutationHock,
} = Api;

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

### 4. Make a Query

```jsx
// component/User.jsx
import {React} from 'react';
import {CoreQueryHock} from '../entity/EntityApi';

function User(props) {
    const {user} = props;
    return <img src={user.get('avatar')} />;
}

const withData = CoreQueryHock(props => {
    return {
        query: UserDataQuery,
        variables: {
            id: props.id
        }
    };
}, ['id']);

export default withData(User);

```



# Enty

Enty is a normalized cache for managing data requested from back-ends. Instead of you manually storing requested data, Enty uses schemas to describe relationships and stores the data in a normalized form.

Views declare which entities they would like, and Enty manages fetching and storing their relationships. Because the entities are stored in a normalized graph, you don't have to worry about how they are updated.


## Code Samples

Enty has two parts: A Schema and an EntityApi.

### 1. Schema
The first step in implementing Enty is to define your schema. This defines what relationships your entities have. A user might have a list of friends which are also users. So we can define that as a user

```js
// entity/ApplicationSchema.js
import {
    ObjectSchema,
    ArraySchema,
    EntitySchema,
} from 'enty';

var user = new EntitySchema('user');
var userList = new ListSchema(user);

user.shape = new ObjectSchema({
    friendList: userList
});

export default new ObjectSchema({
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
import UserQuery from './UserQuery';
import UserListQuery from './UserListQuery';

export default EntityApi({
    user: (variables) => request('/graphql', {query: UserQuery, variables}),
    userList: (variables) => request('/graphql', {query: UserListQuery, variables})
}, ApplicationSchema);
```

### 3. Connect to react

```jsx
// index.js
import {React} from 'react';
import Api from './EntityApi';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <Api.EntityProvider>
        <App />
    </Api.EntityProvider>,
    document.getElementById('app'),
);
```

### 4. Make a Query

```jsx
// ./App.js
import {React} from 'react';
import Api from './EntityApi';
import Spinner from './components/Spinner';

export default function App(props) {
    const message = Api.user.useRequest();

    // request a new user when props.id changes
    useEffect(() => {
        message.request(props.id);
    }, [props.id]);

    if (message.isEmpty || message.isFetching) return <Spinner />;
    if (message.isError) throw message.requestError;

    return <img src={user.avatar} />;
}

```


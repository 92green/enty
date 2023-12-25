# Enty

Enty is a normalized cache for managing data requested from back-ends. Instead of you manually storing requested data, Enty uses schemas to describe relationships and stores the data in a normalized form.

Components declare which entities they would like, and Enty manages fetching and storing their relationships. Because the entities are stored in a normalized graph, you don't have to worry about how they are updated.


## Code Samples

Enty has two parts: Schemas and request hooks.

### 1. Schema
The first step in implementing Enty is to define your schemas. A schema is the information about how entities are related to each other. In this example a users has a list of friends which are also users.

```js
// ./schemas.js
import {ObjectSchema, ArraySchema, EntitySchema} from 'react-enty';

export const UserSchema = new EntitySchema('user');
export const UserListSchema = new ArraySchema(user);

UserSchema.shape = new ObjectSchema({friendList: UserListSchema});
```

### 2. API
The second thing we need to do is to create a request hook to fetch users

```js
// api.js
import {createRequestHook} from 'react-enty';
import {UserSchema} from './schemas';

export const user = createRequestHook({
    name: 'user',
    schema: UserSchema,
    request: (id) => request(`/user/${id}`)
});
```

### 3. Connect to react

```js
// index.js
import {React} from 'react';
import {EntityProvider} from 'react-enty';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    <EntityProvider>
        <App />
    </EntityProvider>,
    document.getElementById('app'),
);
```

### 4. Make a Query

```js
// ./App.js
import {React} from 'react';
import * as api from './api';
import Spinner from './components/Spinner';

export default function App(props) {
    const message = api.user.useRequest({key: props.id});

    // request a new user when props.id changes
    useEffect(() => {
        message.request(props.id);
    }, [props.id]);

    if (message.isEmpty || message.isPending) return <Spinner />;
    if (message.isError) throw message.requestError;

    return <img src={user.avatar} />;
}

```


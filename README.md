# Enty 

## Introduction
Enty is a framework for managing data requested from back-ends and APIs.  Instead of you manually storing requested data, Enty uses schemas to describe relationships and stores the data as normalized entities.

* Views can declare what data they need.
* There is practically no data fetching code.
* Data given to views is always up to date.
* Bad relationships in data become clear.
* pairs wonderfully with graphql


## Purpose

Any webapp that involves  both a back and a front end will create entities. Unique pieces of data that are known by an id.  The back end might call them models, the front end might call them application state, let's call them entities.

<!-- ## too much handling of the data -->
When the client side thinks of storing these entities in terms of endpoints and stores (or even actions and reducers) it's another set of hands touching the data. It allows more places for shady hacks to creep in. It allows more places for code to become brittle. It allows more places for the code to break.

On top of this you force the front end to recreate relationships between entities. Storing data by type in isolated stores logically makes sense, but when a view visually combines two entities (post with comments) you create a point where the front end needs to know exactly how to reconstruct this. This is not an insurmountable problem but as the code base grows so will the places where the front end has to know some specific detail and the places where things can go wrong.

<!-- ## front end concerns.  -->
In reality the front end doesn't care where the data came from or how it is stored. It just knows that it wants a certain number of entities and information about whether they have arrived yet.

<!-- ## Enty -->
Enty lets you describe the relationships of your entities through schemas. It is then able to store them in a normalized state. This means that they are not stored by request but by the unique id that they were given by the back-end.



## Getting Started

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

const Api = EntityApi({
    user: (variables) => request('/graphql', {query: UserQuery, variables}),
    userList: (variables) => request('/graphql', {query: UserListQuery, variables})
}, ApplicationSchema);

export const EntityProvider = Api.Provider;
export const user = Api.user;
export const userList = Api.userList;
```

### 3. Connect to react

```jsx
// index.js
import {React} from 'react';
import {EntityProvider} from './EntityApi';
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

```jsx
// ./App.js
import {React} from 'react';
import {LoadingBoundary} from 'react-enty';
import {user} from './EntityApi';
import Spinner from './components/Spinner';
import Error from './components/Error';

export default function App(props) {
    const message = user.useRequest();

    // request a new user when props.id changes
    useEffect(() => {
        message.onRequest(props.id);
    }, [props.id]);

    return <LoadingBoundary fallback={<Spinner/> error={<Error/>}>
        ({user}) => <img src={user.avatar} />
    </LoadingBoundary>
}

```


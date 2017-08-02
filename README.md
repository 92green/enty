# Enty 
[![enty npm](https://img.shields.io/npm/v/enty.svg?style=flat-square)](https://www.npmjs.com/package/enty)
[![enty circle](https://img.shields.io/circleci/project/github/blueflag/enty.svg?style=flat-square)](https://circleci.com/gh/blueflag/enty)

# Introduction
Enty is a framework for managing data requested from back-ends and APIs.  Instead of you manually storing requested data, Enty uses schemas to describe relationships and stores the data as normalized entities.

* Views can declare what data they need.
* There is practically no data fetching code.
* Data given to views is always up to date.
* Bad relationships in data become clear.
* pairs wonderfully with graphql


# Purpose

<!-- ## models -->
Any webapp that involves  both a back and a front end will create entities. Unique pieces of data that are known by an id.  The back end might call them models, the front end might call them application state, let's call them entities.

<!-- ## too much handling of the data -->
When the client side thinks of storing these entities in terms of endpoints and stores (or even actions and reducers) it's another set of hands touching the data. It allows more places for shady hacks to creep in. It allows more places for code to become brittle. It allows more places for the code to break.

On top of this you force the front end to recreate relationships between entities. Storing data by type in isolated stores logically makes sense, but when a view visually combines two entities (post with comments) you create a point where the front end needs to know exactly how to reconstruct this. This is not an insurmountable problem but as the code base grows so will the places where the front end has to know some specific detail and the places where things can go wrong.

<!-- ## front end concerns.  -->
In reality the front end doesn't care where the data came from or how it is stored. It just knows that it wants a certain number of entities and information about whether they have arrived yet.

<!-- ## Enty -->
Enty lets you describe the relationships of your entities through schemas. It is then able to store them in a normalized state. This means that they are not stored by request but by the unique id that they were given by the back-end.



# Getting Started

Enty has two parts: A Schema and an EntityApi.

## Schema
The first step in implementing Enty is to define your schema. This defines what relationships your entities have. A user might have a list of friends which are also users. So we can define that as a user

```js
import {
    ObjectSchema,
    ListSchema,
    EntitySchema,
} from 'enty';

var user = EntitySchema('user');
var userList = ArraySchema(user);

user.define(ObjectSchema({
    friendList: userList
}))

export default ObjectSchema({
   user,
   userList
});

```

## API
The second thing we need to do is to create our EntityApi from our schema;

```js
import {EntityApi} from 'enty';
import ApplicationSchema from './entity/ApplicationSchema';

const Api = EntityApi(ApplicationSchema, {
    core: payload => request('/graphql', payload)
});

export const {
    store,
    CoreEntityQuery,
    CoreMutationQuery,
} = Api;

```

## Connect to react

```jsx
import {React} from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import {store} from './entity/EntityApi';


ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('app'),
);

```

## Make a Query

```jsx
import {React} from 'react';
import {CoreQueryHock} from './entity/EntityApi';

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


# Enty 

<!-- vim-markdown-toc GFM -->

* [Introduction](#introduction)
* [Installation](#installation)
* [Getting Started](#getting-started)
* [Basics](#basics)
    * [Auto Request](#auto-request)
    * [Sequential Requests](#sequential-requests)
    * [Parallel Requests](#parallel-requests)
    * [LoadingBoundary](#loadingboundary)
    * [CRUD](#crud)
    * [Custom Data Classes](#custom-data-classes)
    * [Caching](#caching)
    * [Service Based Api](#service-based-api)
* [Advanced](#advanced)
    * [Optimistic Updates](#optimistic-updates)
    * [Polling](#polling)
    * [Websockets](#websockets)
    * [Observables](#observables)
    * [List Manipulation](#list-manipulation)
    * [Tainted Entities](#tainted-entities)
    * [Deleting Entities](#deleting-entities)
* [Api](#api)
    * [Schemas](#schemas)
    * [EntityApi](#entityapi)
    * [useRequest](#userequest)
    * [Message](#message)
    * [LoadingBoundary](#loadingboundary-1)
* [Getting Started](#getting-started-1)
    * [1. Schema](#1-schema)
    * [2. API](#2-api)
    * [3. Connect to react](#3-connect-to-react)
    * [4. Make a Query](#4-make-a-query)

<!-- vim-markdown-toc -->

## Introduction
Enty is a normalized cache for front-ends designed to synchronized local state with an external source like a database.

* It's declarative. (Designed for hooks)
* It keeps your data up to date.
* It's low boiler plate.
* It works with promises, async generators and observables.

## Installation
## Getting Started

## Basics
### Auto Request
* Once
* Based On Id
* Callbacks

### Sequential Requests
### Parallel Requests
### LoadingBoundary
### CRUD
### Custom Data Classes
### Caching
### Service Based Api

## Advanced
### Optimistic Updates
### Polling
### Websockets
### Observables
### List Manipulation
### Tainted Entities
### Deleting Entities

## Api
### Schemas
### EntityApi
### useRequest
### Message
### LoadingBoundary


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
        message.request(props.id);
    }, [props.id]);

    return <LoadingBoundary fallback={<Spinner/>} error={<Error/>}>
        ({user}) => <img src={user.avatar} />
    </LoadingBoundary>
}

```


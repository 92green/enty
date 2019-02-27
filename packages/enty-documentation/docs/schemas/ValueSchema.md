---
id: value-schema
title: Value Schema
---

Sometimes data can exist in a partially normalized state. E.g. a user object has a friend key,
but instead of the data giving you the whole object it just returns a user id in its place.

```js
// User
{
    id: '123',
    name: 'foo',
    friend: '456'
}
```

As long as you already have the friend normalized into state, the Value schemas lets you 
denormalize `friend` as a user.


## Params
```js
ValueSchema(
    definition: Schema,
    options?: {
        constructor: (value) => entity
    }
);
```

### definition 
**type:** `Schema`  

The Schema that this value represents.

```js
const user = EntitySchema('user');
const friend = ValueSchema(user);
user.set({friend});
```

## options.constructor
**type:** `(id: string) => *`  
**default:** `(value) => ({id: value})`  

By defualt the ValueSchema constructs a faux entity by placing the value on the `id` key of an 
object. If your definition has a differnt idAtribute function you can replace this to match.

```
const user = EntitySchema('user', {
    idAtribute: user => user.email
});

const friend = ValueSchema(user, {
    constructor: value => ({email: value})
});
user.set({friend});
```



## Methods

### .normalize()
See [normalize](./all-schemas#normalize).

### .denormalize()
See [denormalize](./all-schemas#denormalize).

### .get()
See [get](./all-schemas#get).

### .set()
See [set](./all-schemas#set).

### .update()
See [update](./all-schemas#update).


## Examples

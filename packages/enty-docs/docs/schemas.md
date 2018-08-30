---
path: /schemas
date: 2017-11-07
title: Schemas
---
Schemas are a declarative way to describe to Enty the shape of your api responses and the 
relationships between your data. With this information Enty is able to normalize any response so that
each entity is only ever stored once in your app.

There are two main types of schema: structual schemas and entity schemas.

## Structure
Structural schemas describe the shape of your data and let Enty traverse your data looking for entities
to store. They also provide hooks to let you construct and merge data shapes.

### Constructing
Often data is represented through models or records. Making sure to correctly construct and manage 
these models is often a pain in the front-end. Because enty uses the visitor pattern it is easy for
you to define a single consructor for each object type and let enty do the constructing for you. 
This lets you define your models but never have to worry about constructing them correctly. As new data 
comes in enty takes care of that for you.

```js
{
houseList: [
           {
            id: 'foo',
            streetNumber: '16',
            streetName: 'Collins St',
            suburb: 'Melbourne',
            postCode: 3000
           }
]
    house: {
        id: 'foo'
    }
}
```


### Merging



## Entities
Entity schemas describe to enty where a unique entity can be found in your data shape.

* entities must have a unique name.
* entities must have a unique id.
* entities must have some sort of shape.

```js
const user = EntitySchema('user');
const friendList = ArraySchema(user);
user.set(ObjectSchema({
    friendList
}));
```
In this example we have first defined a user as a type of entity, giving it the unique name of `user`.
Next we define a fiendList that is made up of users.
Next we define the shape of our friend as an object. 
Finally we declare the relationship that users can have friendList's that are arrays of users.

TODO: FriendList normalizing example.

### Changing the idAttribute
By default the EntitySchema looks to user.id property to uniquly idetify each user.
This can be conigured to match your own data structure.

```
const user = EntitySchema('user', {
    idAttribute: user => user.email
});
```

### Why does an entity require a structure?

### Unorthodox Entities


## Unique Data Structures

### Dynamic Schemas
### Orphans
### Composite Entities (Tainting)
### Values
### Rest API's 

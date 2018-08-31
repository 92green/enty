---
path: /schemas
date: 2017-11-07
title: Schemas
---
Schemas are a way to describe to Enty the shape of your api responses and the 
relationships between your data. With this information Enty is able to normalize any response so that
each entity is only ever stored in memory once. This means that when ever your refer to one of your 
entities you can be confident that it is up to date. 

There are two main types of schema: structual schemas and entity schemas.

## Structure
Structural schemas describe the shape of your responses and let Enty traverse your data looking for entities.
They also provide hooks to let you construct and merge data shapes.

### Relationships
Take the following naive data structure. 


```
{
    peopleList: [
        {
            id: '3', 
            name: 'steve',
            mother: {
                id: '1',
                name: 'sally'
            }
            father: {
                id: '2',
                name: 'john'
            }
        },
        {
            id: '4', 
            name: 'susan',
            mother: {
                id: '1',
                name: 'sally'
            }
            father: {
                id: '2',
                name: 'john'
            }
        }
    ]
}

```

From this we can assert that:

* userList is an array of people
* people have a mother who is a person
* people have a father who is a person

So that enty can normalize the data correctly we need to define a person entity and show that they 
can exist both in an personList and as a mother or father

```js
// define our person and personList
const person = EntitySchema('person');
const personList = ArraySchema(person);

// lazily define the relationships between people and their parents
person.set(ObjectSchema({
    mother: person,
    father: person
}));

// export a schema that matches the shape of our api
export default ObjectSchema({
    personList
});
```

### Constructing
Often data is represented through models or records. Making sure to correctly construct and manage 
these models is a pain in the front-end. Because enty uses the visitor pattern it is easy for
you to define a single consructor for each structural schema and let enty do the constructing for you. 

This lets you define your models but never worry about constructing them. As new data comes in it 
is automatically constructed for you.

We can extend the previous example by adding a constructor to our people structural schema

```js
person.set(ObjectSchema(
    {
        mother: person,
        father: person
    }
    {constructor: data => new Person(data)}
));

```

_NOTE: constructors are defined on structure schemas not their entities. This is because the entity 
schema is really just a reference, kind of like a varaible. Just a pointer to an Id in state. An 
entity schemas must have a structural definition so that it knows how to contruct and merge it._


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
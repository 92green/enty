---
id: object-schema
title: Object Schema
---

The ObjectSchema is a structural schema used to define relationships in objects.

## Params
```js
ObjectSchema(
    definition: {
        [key: string]: Schema
    }
    options?: {
        constructor: (entity: A) => B,
        denormalizeFilter: (entity: A) => boolean,
        merge: (previous: A, next: B) => C
    }
);
```
### definition 
**type:**`{[key: string]: string}`  
**default:** `{}`

A javascript object that describes the relationships to other schemas. 
_Note: you only have to define the keys that hold relationships._

```js
const person = EntitySchema('person')
    .set(ObjectSchema({
        friends: friendsSchema,
        cats: catsSchema
    }));
```

### options.constructor 
**type:** `(entity: A) => B`  
**default:** `(entity) => entity`

When an EntitySchema finds a new entity it will call the constructor of its definition before
storing the data in state. _You can use this to construct custom classes for your entities._

```
const person = ObjectSchema({}, {
    constructor: (data) => new Person(data)
});

const user = EntitySchema('user').set(person);
```

### options.merge 
**type:** `(previous: A, next: B) => C`  
**default:** `(previous, next) => ({...previous, ...next})`

When an EntitySchema finds an entity, before storing it in state it checks to see if it has already
been normalized. If it finds an existing entity it will use it's definition schemas merge function 
to combine the two. _The default merge is a simple object spread, use this if your object has its 
own merge method or can't be merged via spreading._

```js
const person = ObjectSchema({}, {
    constuctor: item => new Person(item),
    merge: (prev, next) => prev.merge(next)
});
```


### options.denormalizeFilter 
**type:** `(entity: A) => boolean`  
**default:** `(entity) => entity && entity.deleted`

Sometimes an action will cause the backend to delete an entity. Because Enty stores the results of 
many requests, it is impossible for it to know if an entity has been deleted without rerequesting 
that data. For example, you request a list of users, then you make a second request to delete the 
fourth user. Without either requesting the data again, or manually removing the entity from the 
user list's normalized response we have no way of knowing that the user has indeed been deleted.

_In small instances this seems trivial to solve, but Enty's relational structure means that the now
deleted entity could be in any number of normalized responses. To delete the entity from all 
responses would require you to mimic business logic from the backend on the frontend, and would run
against Enty's second principal._

Enty solves this problem by allowing you to set a sentinel on your entity to indicate that it has 
been deleted. During denormaliziation enty will call denormalizeFilter with the current state of
the entity. If the predicate returns true Enty will not return the entity. 

```js
const person = ObjectSchema({}, {
    constuctor: item => new Person(item),
    denormalizeFilter: (entity) => entity.isDeleted()
});
```


## Methods
### .normalize()
See [normalize](./all-schemas#normalize).

### .denormalize()
See [denormalize](./all-schemas#denormalize).

### .set()
**type:** `(key: string, definition: Schema) => Schema`

Replace the definition schema at a key. 

```js
import {catShape} from 'my-schemas';
const dog = EntitySchema('dog');
const myCatShape = catShape.set('friend', dog);
```


### .get()
**type:** `(key: string) => Schema`

Return the definition schema at a key.
```
const dog = myCatShape.get('friend');
```


### .update()
**type a:** `(updater: (Schema) => Schema) => Schema`  
**type b:** `(key: string, updater: (Schema) => Schema) => Schema`

Overloaded function that lets you user an updater function on either the whole definition or the 
schema at a key.



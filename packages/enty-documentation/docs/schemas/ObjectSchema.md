---
id: object-schema
title: Object Schema
---

The ObjectSchema is a structural schema used to define relationships in objects.

## Params
```
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
_Note: you only have to define the keys that hold relationships_

```
const person = EntitySchema('person', ObjectSchema({
    friends: friendsSchema,
    cats: catsSchema
}));
```

### options.constructor 
**type:** `(entity: A) => B`  
**default:** `(entity) => entity`

When and EntitySchema finds a new entity it will call this function before storing the data in state.
You can use this to construct custom classes for your entities.

```
const person = EntitySchema('person');
person.set(ObjectSchema({}), {
    constructor: (data) => new Person(data)
});
```

### options.merge 
**type:** `(previous: A, next: B) => C`  
**default:** `(previous, next) => ({...previous, ...next})`

When an EntitySchema finds an entity, before putting storing it in the NormalizeState object
it checks to see if it has already been normalized. If it finds an existing entity it will use 
it's definition schemas merge function to combine the two. 


### options.denormalizeFilter 
**type:** `(entity: A) => boolean`  
**default:** `(entity) => entity && entity.deleted`

Sometimes an action will cause the backend to delete an entity. Because Enty stores the results of 
many requests, it is impossible for it to know if an entity has been deleted without rerequesting 
that data. For example, you request a list of users, then you make a second request to delete the 
fourth user. Without either requesting the data again, or manually removing the entity from the 
user list's normalized result we have no way of knowing that the user has indeed been deleted.

Enty solves this problem by allowing you to set a sentinel on your entity to indicate that it has 
been deleted. During denormaliziation enty will call denormalizeFilter with the current state of
the entity. If the predicate returns true Enty will not return the entity. 



## Methods
### .normalize()
see [schema.normalize].


### .denormalize()
see [schema.denormalize].


### .get()
**type:** `get(key: string): Schema`

Return the definition schema at a key.


### .set()
```
schema.set(schema: Schema): Schema
```
Replace the definition schema at a key.


### .update()
```
schema.update(updater: (Schema) => Schema): Schema
```
Replace the definition schema via an updater function


## Examples
```js
const user = entity('user');
user.set(ObjectSchema({
    friends: ListSchema(user)
}));
```

```
@param definition - an object describing any entity relationships that should be traversed.
@param options
```



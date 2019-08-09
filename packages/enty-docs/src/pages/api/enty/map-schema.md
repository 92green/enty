---
id: map-schema
title: Map Schema
---

The MapSchema is identical in function to [ObjectSchema] but its constructor and merge functions
will cast your object to an immutable map. _This is especially useful when working with immutable 
data structures as all data creation can be handled by your schema. Just describe the shapes that 
your apis will return and Enty will automatically construct all of your maps and lists for you._

## Params
```js
MapSchema(
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
**type:**`{[key: string]: StructuralSchema}`  
**default:** `{}`

A javascript object that describes the relationships to other schemas. 
_Note: you only have to define the keys that hold relationships._

```js
const person = EntitySchema('person')
    .set(MapSchema({
        friends: friendsSchema,
        cats: catsSchema
    }));
```

### options.constructor 
**type:** `(entity: A) => B`  
**default:** `(entity) => entity`


### options.merge 
**type:** `(previous: A, next: B) => C`  
**default:** `(previous, next) => previous.merge(next)`

See [ObjectSchema.options.merge()](./object-schema#optionsmerge).



### options.denormalizeFilter 
**type:** `(entity: A) => boolean`  
**default:** `(entity) => entity && entity.get('deleted')`

See [ObjectSchema.options.denormalizeFilter()](./object-schema#optionsdenormalizeFilter).


## Methods
### .normalize()
See [normalize](./all-schemas#normalize).

### .denormalize()
See [denormalize](./all-schemas#denormalize).

### .set()
See [ObjectSchema.set()](./object-schema#set).


### .get()
See [ObjectSchema.get()](./object-schema#get).


### .update()
See [ObjectSchema.update()](./object-schema#update).

[ObjectSchema]: ./object-schema



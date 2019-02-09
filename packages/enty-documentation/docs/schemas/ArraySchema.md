---
id: array-schema
title: Array Schema
---

The ArraySchema is a structural schema used to define relationships in homogeneous arrays.

## Params

```js
ArraySchema(
    definition: Schema<Structure>,
    options?: {
        constructor: (entity: A) => B
    }
);
```

### definition 
**type:**`Schema<Structure>`  

A single structural schema that describes what is in this collection.

```js
const person = EntitySchema('person');
const friends = ArraySchema(person);
```

### options.constructor 
**type:** `(entity: A) => B`  
**default:** `(entity) => entity`

When an EntitySchema finds a new entity it will call the constructor of its definition before
storing the data in state. _You can use this to construct custom classes for your entities._

```js
const friends = ArraySchema(person, {
    constructor: (entity) => List(entity)
});
```

### options.merge 
**type:** `(previous: A, next: B) => C`  
**default:** `(previous, next) => next`

When an EntitySchema finds an entity, before storing it in state it checks to see if it has already
been normalized. If it finds an existing entity it will use it's definition schemas merge function 
to combine the two. _Note: The default merge for an array is to just accept the new one. But you can
create some interesting funcitonality with cusome merge function. E.g. if your merge functions concats
the two arrays, you would create an append only list._

```js
const person = ArraySchema({}, {
    merge: (prev, next) => prev.concat(next)
});
```


## Methods

### .normalize()
See [normalize](./all-schemas#normalize).

### .denormalize()
See [denormalize](./all-schemas#denormalize).

### .get()
See [get](./all-schemas#get).

### .set()
See [set].

### .update()
See [update](./all-schemas#update).


[set]: ./all-schemas#set

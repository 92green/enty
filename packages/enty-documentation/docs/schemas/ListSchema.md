---
id: list-schema
title: List Schema
---

The ListSchema is identical in function to [ArraySchema] but its constructor and merge functions
will cast your list to an immutable list. _This is especially useful when working with immutable 
data structures as all data creation can be handled by your schema. Just describe the shapes that 
your apis will return and Enty will automatically construct all of your maps and lists for you._

## Params

```js
ListSchema(
    definition: StructuralSchema,
    options?: {
        constructor: (entity: A) => B
    }
);
```

### definition 
**type:**`StructuralSchema`  

A single structural schema that describes what is in this collection.

```js
const person = new EntitySchema('person');
const friends = ListSchema(person);
```

### options.constructor 
**type:** `(entity: A) => B`  
**default:** `(entity) => List(entity)`

See [ArraySchema.options.constructor()](./array-schema#optionsconstructor).


### options.merge 
**type:** `(previous: A, next: B) => C`  
**default:** `(previous, next) => previous.merge(next)`

See [ArraySchema.options.merge()](./array-schema#optionsmerge).


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
[ArraySchema]: /docs/schemas/array-schema


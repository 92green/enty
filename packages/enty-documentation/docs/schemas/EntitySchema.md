---
id: entity-schema
title: Entity Schema
---

Entity schemas describe to enty where a unique entity can be found in your data shape.

* entities must have a unique name.
* entities must have a unique id.
* entities must have some sort of shape.


## Params

```js
EntitySchema(
    name: string,
    options?: {
        definition: Schema<Structure>,
        idAttribute: (entity: Object) => string
    }
);
```

### name 
**type:** `string`  

Each category of entity requires a name so that Enty can store and locate them in state.
It must be unique amongst your collection of schemas. 

```js
const user = EntitySchema('user');
const cat = EntitySchema('cat');
```


### options.definition 
**type:** `Schema<Structure>`  

Because entities can come in many shapes Enty chooses not to define this in the EntitySchema.
All EntitySchemas must contain a definition of their shape.  

_Note: the definition can also be updated via the [.set()](./all-schemas#set) method._

```js
const person = EntitySchema('person', {
    definition: ObjectSchema({})
});

const notifications = EntitySchema('notifications', {
    definition: ArraySchema(notifications)
});
```

### options.idAttribute
**type:** `(any) => string`  
**defaults:** `(entity) => entity && entity.id`

Defines where the EntitySchema can locate each entity's id value.

```js
const user = EntitySchema('user', {
    idAttribute: (user) => user.email
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


## Examples

[set]: ./all-schemas#set

---
id: composite-entity-schema
title: Composite Entity Schema
---

Sometimes a backend will merge two data types together and in the process create an entity that is 
not possible to normalize. Enty calls this a Tainted Entity. Consider a course page that shows
the completion state for the current user. The client makes a request to the course completion
endpoint and the server responds with a course object with an attached completion. 

```js
// /course/completion?user=derek.tibbs

{
    id: 'mf101',
    name: 'Making Friends 101'
    duration: '10 weeks',
    completion: {
        id: '456',
        grade: 'A',
        user: 'derek.tibbs',
        completedAt: "2019-02-20"
    }
}
```

This works fine for a single page, but when we try to normalize multiple course completions we 
realise that each different normalization is affecting the `mf101` course entity and whoever 
normalizes last is the winner.

The CompositeEntitySchema lets you separate tainted entities into a state that is able to be
normalized.

```js
{
    id: 'mf101-456', 
    course: {
        id: 'mf101',
        name: 'Making Friends 101'
        duration: '10 weeks',
    },
    completion: {
        id: '456',
        grade: 'A',
        user: 'derek.tibbs',
        completedAt: "2019-02-20"
    }
}
```

## Params
```js
CompositeEntitySchema(
    name: string,
    options?: {
        compositeKeys: {
            [key: string]: Schema
        },
        definition: Schema<Structure>,
        idAttribute: (*) => string
    }
);
```

### name 
**type:** `string`  

See [EntitySchema.name](./entity-schema#name)

### options.definition 
**type:** `Schema`  

The definition of the main schema that has been tainted by other keys.

See [EntitySchema.options.definition](./entity-schema#optionsdefinition)

```js
const courseCompletion = CompositeEntitySchema('courseCompletion', {
    definition: course
});
```


### options.compositeKeys
**type:** `{[key: string]: Schema}`  

An object mapping of the keys that are tainting this entity and the schema that they belong to.

```js
const completion = EntitySchema('completion');
const courseCompletion = CompositeEntitySchema('courseCompletion', {
   definition: course,
   compositeKeys: {
        completion
   }
});
```


### options.idAttribute
**type:** `(*) => string`  
**defaults:** `(entity) => entity && entity.id`

See [EntitySchema.options.idAttribute](./entity-schema#optionsidattribute)


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

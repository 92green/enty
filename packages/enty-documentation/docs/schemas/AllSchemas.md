---
id: all-schemas
title: All Schemas
---

All schemas share some common methods.


## .normalize()
**type:** `(data: *, entities: Object = {}) => NormalizeState`

Use the schemas relationships to normalize for storage.

```js
const person = EntitySchema('person', {
    definition: ObjectSchema({})
});
const people = ArraySchema(person);

people.normalize([
    {id: 'foo', name: 'fooschia'},
    {id: 'bar', name: 'bartholomew'}
]);
/*
{
    result: ['foo', 'bar'],
    entities: {
        person: {
            foo: {id: 'foo', name: 'fooschia'},
            bar: {id: 'bar', name: 'bartholomew'}
        }
    }
}
*/
```

* You can provided existing entities this will perform a merge.
* The input shape must match the shape of the definition schema.


## .denormalize()
**type:** `(state: {result: *, entities: *}) => *`

Denormalize is the reverse of normalize. When given a normalized result and a set of entities
it will reconstruct the data from the entities. You can loosly describe it as :
`a === schema.denormalize(schema.normalize(a))`

_Note: the result shape must match the shape of the schema_

```js
const person = EntitySchema('person', {
    definition: ObjectSchema({})
});
const people = ArraySchema(person);

people.denormalize({
    result: ['foo', 'bar'],
    entities: {
        person: {
            foo: {id: 'foo', name: 'fooschia'},
            bar: {id: 'bar', name: 'bartholomew'}
        }
    }
});

/*
[
    {id: 'foo', name: 'fooschia'},
    {id: 'bar', name: 'bartholomew'}
]
*/

```


## .set()
**type:** `(definition: Schema) => Schema`

Replace the definition schema. Used most often to defer the definition of recursive schemas.

```js
const cat = EntitySchema('cat');
const cats = ArraySchema(cat);

cat.set(ObjectSchema({
    friends: cats
});

```


## .get()
**type:** `() => Schema`

Return the definition schema


## .update()
**type:** `(updater: (Schema) => Schema) => Schema`

Replace the definition schema via an updater function

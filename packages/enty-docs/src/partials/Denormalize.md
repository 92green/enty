
**type:** `(state: {result: *, entities: *}) => *`

Denormalize is the reverse of normalize. When given a normalized result and a set of entities
it will reconstruct the data from the entities. You can loosly describe it as:
`a === schema.denormalize(schema.normalize(a))`

_Note: the result shape must match the shape of the schema_

```js
const person = new EntitySchema('person', {
    shape: new ObjectSchema({})
});
const people = new ArraySchema(person);

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


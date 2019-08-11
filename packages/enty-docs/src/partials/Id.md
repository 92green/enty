
**type:** `(data: *, entities: Object = {}) => NormalizeState`

Use the schemas relationships to normalize for storage.

```js
const person = new EntitySchema('person', {
    shape: new ObjectSchema({})
});
const people = new ArraySchema(person);

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

* You can provide existing entities this will perform a merge.
* The input shape must match the shape of the definition schema.

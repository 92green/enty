
**type:** `(data: *, entities: Object = {}) => NormalizeState`

Use the schemas relationships to normalize for storage.

```js
function Normalize() {
    const person = new EntitySchema('person', {
        shape: new ObjectSchema({})
    });
    const people = new ArraySchema(person);

    const state = people.normalize([
        {id: 'foo', name: 'fooschia'},
        {id: 'bar', name: 'bartholomew'},
        {id: 'foo', lastName: 'foofoo'},
        {id: 'bar', lastName: 'barterer'},
    ]);

    return <JSON data={state.entities} />;
}
```

* You can provide existing entities this will perform a merge.
* The input shape must match the shape of the definition schema.

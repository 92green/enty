---
id: dynamic-schema
title: Dynamic Schema
---

The dynamic schema lets you choose a schema based on the data that is being normalized. 
The definition takes a function that will be called with each peice of data. The return value of
that function will then be used to continue the normalizing. _This is useful if you have 
non-homogeneous arrays or union types._

## Params
```js
DynamicSchema(definition: (*) => Schema);
```

### definition 
**type:** `(*) => Schema`  

A function that will be given the current data that must return a schema to 
normalize it with.

```
const group = new EntitySchema('group');
const user = new EntitySchema('user');

const groupOrUser = DynamicSchema((data) => {
    const schemaTypes = {group, user};
    return schemaTypes[data.type];
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
See [set](./all-schemas#set).

### .update()
See [update](./all-schemas#update).


## Examples

### Non-homogeneous Array
If you have a array that contains multiple types of object the ArraySchema alone wont quite work
because it can only handle homogeneous arrays. The dynamic schema can let you inspect each item
and choose the appropriate schema to normalize it with.

```js
const account = new EntitySchema('account');
const group = new EntitySchema('group');
const user = new EntitySchema('user');

const thing = DynamicSchema((data) => {
    const schemaTypes = {
        account,
        group,
        user
    };
    const schema = schemaTypes[data.type];
    if(!schema) throw `No schema found for ${data.type}`;
    return schema;
});


ArraySchema(thing).denormalize([
    {id: '1', type: 'user', name: 'Steve'},
    {id: '2', type: 'group', name: 'Steves Group'},
    {id: '3', type: 'account', name: 'Steves Account'}
]);

/* {
    entities: {
        account: {
            3: {id: '3', type: 'account', name: 'Steves Account'}
        },
        group: {
            2: {id: '2', type: 'group', name: 'Steves Group'},
        },
        user: {
            1: {id: '1', type: 'user', name: 'Steve'},
        }
    },
    result: [
        {definitionResult: '1', definitionSchema: user},
        {definitionResult: '2', definitionSchema: group},
        {definitionResult: '3', definitionSchema: account},
    ]

} */
```



### Union Type
Similar to the above example, DynamicSchemas can be used when a key in an object
contains more than one data type.

```js
const account = new EntitySchema('account');
const group = new EntitySchema('group');
const accountOrGroup = DynamicSchema((data) => {
    const schemaTypes = {group, user};
    return schemaTypes[data.type];
});

const user = new EntitySchema('user')
    .set(ObjectSchema({
        parent: accountOrGroup
    });
```


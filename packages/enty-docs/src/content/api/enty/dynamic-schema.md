---
id: dynamic-schema
title: Dynamic Schema
group: Enty
---

The dynamic schema lets you choose a schema based on the data that is being normalized. 
The shape takes a function that will be called with each peice of data. The return value of
that function will then be used to continue the normalizing. _This is useful if you have 
non-homogeneous arrays or union types._

## Params
```js
DynamicSchema(shape: (*) => Schema);
```

### shape 
**type:** `(*) => Schema`  

A function that will be given the current data that must return a schema to 
normalize it with.

```
const group = EntitySchema('group');
const user = EntitySchema('user');

const groupOrUser = DynamicSchema((data) => {
    const schemaTypes = {group, user};
    return schemaTypes[data.type];
});
```


## Methods

### .normalize()
<Normalize />

### .denormalize()
<Denormalize />


## Examples

### Non-homogeneous Array
If you have a array that contains multiple types of object the ArraySchema alone wont quite work
because it can only handle homogeneous arrays. The dynamic schema can let you inspect each item
and choose the appropriate schema to normalize it with.

```js
const account = EntitySchema('account');
const group = EntitySchema('group');
const user = EntitySchema('user');

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
        {shapeResult: '1', shapeSchema: user},
        {shapeResult: '2', shapeSchema: group},
        {shapeResult: '3', shapeSchema: account},
    ]

} */
```



### Union Type
Similar to the above example, DynamicSchemas can be used when a key in an object
contains more than one data type.

```js
const account = EntitySchema('account');
const group = EntitySchema('group');
const accountOrGroup = DynamicSchema((data) => {
    const schemaTypes = {group, user};
    return schemaTypes[data.type];
});

const user = EntitySchema('user')
    .set(ObjectSchema({
        parent: accountOrGroup
    });
```


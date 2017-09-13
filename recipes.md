# Composing
Because Enty's schemas are just functions that return new instances
you can create factory functions to compose schema types togther

## Object Entity
```
function entity(name, definition, options) {
    return EntitySchema(name, {
        definition: MapSchema(definition),
        ...options
    })
}

const user = entity('user', {
    friendList: ListSchema(friend)
});
```

## Immutable Record Entity
```
function record(name, Record, options) {
    return EntitySchema(name, {
        constructor: (entity) => new Record(entity.toObject())
        ...options
    })
}


const user = record('user', UserRecord);
```

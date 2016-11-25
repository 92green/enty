* `mainSchema` action key is now `ENTITY_RECEIVE`
* DetermineReviverType function signature is switched. Is now (value, key) => newValue
* createEntityReducer now takes one object with a `schemaMap` prop on it.

```js
// before
createEntityReducer({
    mainSchema: EntitySchema,
    GRAPHQL_RECEIVE: EntitySchema,
    'trc/course/LIST_RECEIVE': EntitySchema.courseList,
}, EntityReviver),

// after
createEntityReducer({
    schemaMap: {
        'ENTITY_RECEIVE': EntitySchema,
        GRAPHQL_RECEIVE: EntitySchema,
        'trc/course/LIST_RECEIVE': EntitySchema.courseList
    },
    beforeNormalize: () => {},
    afterNormalize: () => {}
})
```

* EntityReviver is now a key on config: beforeNormalize

```js
// before
createEntityReducer({
    mainSchema: EntitySchema
}, EntityReviver),

// after
createEntityReducer({
    schemaMap: {
        'ENTITY_RECEIVE': EntitySchema
    },
    beforeNormalize: () => {},
    afterNormalize: () => {}
})
```

```
const store = EntyStore({});

const message = useMessage({
    request: store.api.person.list,
    ttl: 300
});


<EntyProvider store={store}>
    {...}
</EntyProvider>

```

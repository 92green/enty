/*
- Get 
- Get one 
- Get many 
- Update 
- Update 


*/
const Store: Function = () => {};
const useEntity: Function = () => {};
const useParcelState: Function = () => {};
const PersonSchema = {};
const api: {get: Function; post: Function} = {get: () => {}, post: () => {}};

const store = Store({
    person: {
        schema: PersonSchema,
        get: async ({id, ttl = 2000, query, schema, store}) => {
            const {getMeta, updateMeta, getEntity, updateEntity} = store.getUpdaters('person', id);
            updateMeta('isPending', true);
            if (getMeta('ttl') > ttl) {
                const person = await api.get(query);
                await updateEntity(person);
            }
            updateMeta('isPending', false);
            return getEntity();
        },
        update: async ({id, query, schema, store}) => {
            const person = await api.post(query);
            await store.update(schema, person);
            return store.get('person', id);
        }
    },
    personList: {
        schema: new ArraySchema(PersonSchema),
        get: getWithCache(query, {defaultTTL: 20000}),
        update: update(query)
    }
});

function getOne(props: any) {
    const [person, {isPending}] = useEntity({
        type: 'person',
        id: props.id,
        ttl: 10000
    });

    if (isPending && !person) return 'loading...';

    return <div>{person.name}</div>;
}

function getParallel(props: any) {
    const [foo, fooState] = useEntity({
        type: 'person',
        id: props.fooId,
        ttl: 10000
    });

    const [bar, barState] = useEntity({
        type: 'person',
        id: props.barId,
        ttl: 10000
    });

    if (fooState.isPending || barState.isPending || !foo || !bar) return 'loading...';

    return (
        <div>
            {foo.name}, {bar.name}
        </div>
    );
}

function save(props: any) {
    const [person, {isPending, store}] = useEntity({
        type: 'person',
        id: props.id,
        ttl: 10000
    });

    const [personForm, formState] = person.useParcelForm({
        onSubmit: (parcel) =>
            store.update({
                type: 'person',
                id: props.id,
                query: parcel.value
            })
    });

    if ((isPending && !person) || formState.submitStatus.isPending) return 'loading...';

    return (
        <div>
            <input {...personForm.get('name').spreadDOM()} />
            <button onClick={() => formState.submit()}>save</button>
        </div>
    );
}

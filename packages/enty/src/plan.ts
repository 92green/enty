type InputPerson = {
    name: string;
    id: string;
};

class Person {
    constructor(input: InputPerson) {}
}

const person = EntitySchema<InputPerson>({
    name: 'person',
    id: data => data.id,
    create: (data: InputPerson) => new Person(data),
    merge: (aa, bb) => new Person({...aa, ...bb}),
    relationships: () => ({
        friend: person
    })
});

const todos = new EntitySchema<InputPerson>({
    name: 'todos',
    id: data => data._id,
    merge: (aa, bb) => {
        if (bb._prepend) return bb.concat(aa);
        if (bb._append) return aa.concat(bb);
        return bb;
    },
    relationships: [todo]
});

const store = new EntityStore();

export async function fetchPerson(id, query) {
    const ttl = 1000;
    const [person, {meta}] = store.get('person', id);
    if (meta.lastUpdate - Date.now() > ttl) {
        try {
            store.normalize(person, {id}, {isPending: true, ...query});
            const data = (await fetch('/person', query)).json();
            store.normalize(person, data, {isSuccess: true, ...query});
        } catch (error) {
            store.normalize(person, {id}, {isError: true, error, ...query});
        }
    }
    return store.get(person, id);
}


function Component

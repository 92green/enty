import React, {useEffect, useLayoutEffect, useState, useCallback} from 'react';
import {EntitySchema, ArraySchema, ObjectSchema} from '../src/index';
import {State, Meta, SchemasUsed, NormalizeReturn} from '../src/util/definitions';

//
// Utils
function delay(ms, value) {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

const post = async (query) => {
    const response = await fetch('https://swapi-graphql.netlify.app/.netlify/functions/index', {
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({query}),
        method: 'POST'
    });
    return await response.json();
};

//
// Enty State
type EntityRequestArgs = {
    schema: EntitySchema<any>;
    id: string;
    method: 'load' | 'save';
    loadData?: any;
    saveData?: any;
};

type Respond = (
    update: Function,
    args: EntityRequestArgs,
    store: Store
) => AsyncGenerator<NormalizeReturn>;

type Meta = {
    pending?: boolean;
    success?: boolean;
    error?: Error;
    normalizeTime?: number;
};

class Store {
    _events: Record<string, Function[]>;
    _respond: Respond;
    _state: State;
    _schemasUsed: SchemasUsed;
    constructor(respond: Respond, initialState: State = {}, schemasUsed: SchemasUsed = {}) {
        this._events = {};
        this._state = initialState;
        this._schemasUsed = schemasUsed;
        this._respond = respond;
    }

    _getStateTuple(schema: EntitySchema<any>, id: string): [any, Meta] {
        return this._state[schema.name]?.[id] || [null, {}];
    }

    get(schema: EntitySchema<any>, id: string): [any, Meta] {
        const entity = schema.denormalize({
            state: this._state,
            output: id
        });
        return [entity, this._getStateTuple(schema, id)[1]];
    }

    setMeta(schema: EntitySchema<any>, id: string, meta: Meta) {
        const type = schema.name;
        this._state[type] = this._state[type] || {};
        this._state[type][id] = this._state[type][id] || [null, {}];
        this._state[type][id][1] = {...this._state[type][id][1], ...meta};
        return this;
    }

    update(schema: EntitySchema<any>, input: any, meta: Meta) {
        const value = schema.normalize({state: this._state, input, meta});
        this._state = value.state;
        this._schemasUsed = value.schemasUsed;
        return this;
    }

    async trigger(args: EntityRequestArgs) {
        const update = (data, meta) => this.update(args.schema, data, meta);
        const {schema, id} = args;
        const name = schema.name;
        for await (const _ of this._respond(update, args, this)) {
            if (this._events[name]) {
                const list = Object.keys(this._state[name]).map((id) => this.get(schema, id));
                this._events[name].forEach((cb) => cb(list));
            }
            this._events[schema.name + id].forEach((cb) => cb(this.get(schema, id)));
        }
    }
    subscribe(args: EntityRequestArgs, callback: Function) {
        const {schema, id = ''} = args;
        const key = schema.name + id;
        this._events[key] = this._events[key] || [];
        this._events[key].push(callback);
        this.trigger(args);
        return () => {
            this._events[key] = this._events[key].filter((i) => i !== callback);
        };
    }
}

// Requesters
function asyncRequest(config: {args: EntityRequestArgs; store: Store; ttl: number}) {
    const {store, args, ttl} = config;
    const {schema, id} = args;

    return async function* (request: Function) {
        const [entity, meta] = store.get(schema, id);

        if (entity && Date.now() - meta.normalizeTime <= ttl * 1000) return yield;

        yield store.setMeta(schema, id, {pending: true});
        try {
            const data = await request(config);
            yield store.update(schema, data, {
                pending: false,
                normalizeTime: Date.now()
            });
        } catch (error) {
            yield store.setMeta(schema, id, {pending: false, error});
        }
        return;
    };
}

//
// React Stuff
const Context = React.createContext<Store | undefined>(undefined);
const Provider = ({store, ...rest}: {store: Store}) => <Context.Provider value={store} {...rest} />;
const useStore = () => {
    const store: Store | undefined = React.useContext(Context);
    if (!store) {
        throw new Error('No Enty Provider found');
    }
    return store;
};

function useEntity(config: {
    schema: EntitySchema<any>;
    id: string;
    loadData?: any;
    shouldSubscribe?: boolean;
}): [any, Meta, Function] {
    const {schema, id, loadData = {}, shouldSubscribe = true} = config;
    const store = useStore();
    const [stateTuple, setState] = useState([null, {}]);

    const onSave = useCallback(
        (saveData) => {
            store.trigger({schema, id, method: 'save', saveData});
        },
        [schema, id]
    );

    useEffect(() => {
        if (!shouldSubscribe) return;
        return store.subscribe({schema, id, method: 'load', loadData}, setState);
    }, [schema, id, JSON.stringify(loadData), shouldSubscribe]);

    return [stateTuple[0], stateTuple[1], onSave];
}

function useEntityList(config: {schema: EntitySchema<any>}): Array<[any, Meta]> {
    const {schema} = config;
    const store = useStore();
    const [entityTupleList, setState] = useState([]);
    useEffect(() => {
        return store.subscribe({schema, method: 'list'}, setState);
    }, [schema]);
    return [entityTupleList];
}

//
//
// Implementation

// Schema Definitions
const PersonSchema = new EntitySchema('person', {});
const PlanetSchema = new EntitySchema('planet');
const FilmSchema = new EntitySchema('film');

PersonSchema.shape = new ObjectSchema({
    homeworld: PlanetSchema,
    filmConnection: new ObjectSchema({
        films: new ArraySchema(FilmSchema)
    })
});

FilmSchema.shape = new ObjectSchema({
    planetConnection: new ObjectSchema({
        planets: new ArraySchema(PlanetSchema)
    })
});

const personQuery = (id) => `{
  person(id: "${id}") {
    id,
    name
    birthYear
    gender
    homeworld { id name }
    filmConnection {
      films {
        id
        title
        planetConnection {
          planets {
            id
            name
          }
        }
      }
    }
  }
}`;

const myStore = new Store(async function* (update, args: EntityRequestArgs, store) {
    const {method, schema, id, loadData, saveData} = args;
    const loadRequest = asyncRequest({store, args, ttl: 5});
    //const saveRequest = asyncRequest({store, args, ttl: 10});

    switch (`${schema.name}.${method}`) {
        case 'person.load':
            return yield* loadRequest(async () => {
                const {data, errors} = await post(personQuery(id));
                const error = errors?.[0]?.message;
                if (error) throw new Error(error);
                return data.person;
            });

        case 'person.save':
            return yield update(saveData);
    }
});

function PersonTable({person}) {
    return (
        <table>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>{person.name}</td>
                </tr>
                <tr>
                    <td>Homeworld</td>
                    <td>{person.homeworld.name}</td>
                </tr>
                <tr>
                    <td>Born</td>
                    <td>{person.birthYear}</td>
                </tr>
                <tr>
                    <td>Gender</td>
                    <td>{person.gender}</td>
                </tr>
                <tr>
                    <td>Nickname (local)</td>
                    <td>{person.nickname}</td>
                </tr>
            </tbody>
        </table>
    );
}

function Person({id}) {
    const [person, meta] = useEntity({schema: PersonSchema, id});
    if (meta.pending) return <div>loading...</div>;
    if (meta.error) return <div>{meta.error.message}</div>;
    if (!person) return <div>empty</div>;
    return <PersonTable person={person} />;
}

function Load() {
    const [id, setId] = useState('cGVvcGxlOjE=');

    return (
        <div>
            <button onClick={() => setId('cGVvcGxlOjE=')}>Luke</button>
            <button onClick={() => setId('cGVvcGxlOjIy')}>Bobba Fett</button>
            <button onClick={() => setId('cGVvcGxlOjIw')}>Yoda</button>
            <Person id={id} />
        </div>
    );
}

function Create() {
    const [id, setId] = useState('cGVvcGxlOjE=');
    const [personForm, updateForm] = useState(null);
    const [person, meta, savePerson] = useEntity({schema: PersonSchema, id});

    const onChange = (key) => (ee) => updateForm({...personForm, [key]: ee.target.value});

    useEffect(() => {
        updateForm(person);
    }, [person]);

    if (!person) return <div>empty</div>;
    if (meta.pending) return <div>loading...</div>;
    if (meta.error) return <div>{meta.error.message}</div>;
    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td>
                            <input value={personForm.name} onChange={onChange('name')} />
                        </td>
                    </tr>
                    <tr>
                        <td>Born</td>
                        <td>
                            <input value={personForm.birthYear} onChange={onChange('birthYear')} />
                        </td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td>
                            <input value={personForm.gender} onChange={onChange('gender')} />
                        </td>
                    </tr>
                    <tr>
                        <td>Nickname (local)</td>
                        <td>
                            <input value={personForm.nickname} onChange={onChange('nickname')} />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button onClick={() => savePerson(personForm)}>save</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button onClick={() => setId('cGVvcGxlOjE=')}>Luke</button>
            <button onClick={() => setId('cGVvcGxlOjIy')}>Bobba Fett</button>
            <button onClick={() => setId('cGVvcGxlOjIw')}>Yoda</button>
        </div>
    );
}

function Parallel() {
    return (
        <div>
            <Person id="cGVvcGxlOjIx" />
            <Person id="cGVvcGxlOjI1" />
        </div>
    );
}

function Sequential() {
    const [luke, lukeMeta] = useEntity({schema: PersonSchema, id: 'cGVvcGxlOjE='});
    const [yoda, yodaMeta] = useEntity({
        schema: PersonSchema,
        id: 'cGVvcGxlOjIw',
        shouldSubscribe: !!luke
    });

    if (lukeMeta.pending) return <div>loading luke...</div>;
    if (yodaMeta.pending || !yoda) return <div>loading yoda...</div>;
    if (lukeMeta.error) return <div>{lukeMeta.error.message}</div>;
    if (yodaMeta.error) return <div>{yodaMeta.error.message}</div>;
    if (!luke && !yoda) return <div>empty</div>;

    return (
        <div>
            {luke && <PersonTable person={luke} />}
            {yoda && <PersonTable person={yoda} />}
        </div>
    );
}

function List() {
    const [list] = useEntityList({schema: PersonSchema});
    console.log(list);
    return (
        <ol>
            {list.map(([person, {pending, error}]) => {
                if (pending) return <li>loading...</li>;
                if (error) return <li>{meta.error.message}</li>;
                if (!person) return <li>empty</li>;
                return (
                    <li key={person.id}>
                        {person.name} - {person.homeworld.name}
                    </li>
                );
            })}
        </ol>
    );
}

function Debug() {
    const [person, meta] = useEntity({schema: PersonSchema, id: 'cGVvcGxlOjE='});
    const store = useStore();
    return <pre>{JSON.stringify(store._state, null, 4)}</pre>;
}

/*

# Todo
- Request Hook performance
- Update entities
- Entities update each other
- subscribe to list of entities
- denormalizing cache
- EnityApi shim


* Fetch
* Sequential
* Parallel
- List
* Update
- Create
- nested hooks causes loops

*/

export default function Layout() {
    //<h1>Load</h1>
    //<Load />
    //<h1>Create / Update</h1>
    //<Create />
    return (
        <Provider store={myStore}>
            <h1>List</h1>
            <List />
            <h1>Load</h1>
            <Load />
        </Provider>
    );
}

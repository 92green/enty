import React, {useEffect, useState, useCallback} from 'react';
import {EntitySchema, ArraySchema, ObjectSchema} from '../src/index';
import {EntityRequestArgs, Meta} from '../src/store/Store';
import Store from '../src/store/Store';

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

// Requesters

//
// React Stuff
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

const planetQuery = (id) => `{
  planet(id: "${id}") {
    id,
    name
  }
}`;

const myStore = new Store(async function* (update, args: EntityRequestArgs, store) {
    const {method, schema, id, loadData, saveData} = args;
    const loadRequest = asyncRequest({store, args, ttl: 0});
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

        case 'planet.load':
            return yield* loadRequest(async () => {
                const {data, errors} = await post(planetQuery(id));
                const error = errors?.[0]?.message;
                if (error) throw new Error(error);
                return data.planet;
            });
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
    const [id, setId] = useState('cGVvcGxlOjI1');

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
    const [list] = useEntityList({schema: PlanetSchema});
    const [unknown, unknownMeta] = useEntity({
        schema: PlanetSchema,
        id: 'cGxhbmV0czoyOA=='
    });

    console.log([unknown, unknownMeta]);

    return (
        <table>
            <tbody>
                <tr>
                    <td>Planet</td>
                    <td>{unknown && unknown.name}</td>
                    <td>{unknownMeta.normalizeTime}</td>
                </tr>
                {list.map(([planet, {pending, error, normalizeTime}]) => {
                    if (pending) return <li>loading...</li>;
                    if (error) return <li>{error.message}</li>;
                    if (!planet) return <li>empty</li>;
                    const dd = new Date(normalizeTime);
                    return (
                        <tr key={planet.id}>
                            <td>{planet.name}</td>
                            <td>{planet.id}</td>
                            <td>
                                {dd.getHours()}:{String(dd.getMinutes()).padStart(2, '0')}:
                                {String(dd.getSeconds()).padStart(2, '0')}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
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
* subscribe to list of entities
- denormalizing cache
- EnityApi shim


* Fetch
* Sequential
* Parallel
* List
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
            <h1>Planets</h1>
            <List />
            <h1>Load</h1>
            <Load />
            <Debug />
        </Provider>
    );
}

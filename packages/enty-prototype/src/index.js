// @flow
import ReactDOM from 'react-dom';
import React from 'react';
import {useEffect, useState} from 'react';
import {ObjectSchema, ArraySchema, EntitySchema, EntityApi} from 'react-enty-hooks';
import faker from 'faker';
import Hash from 'enty-state/lib/util/Hash';


const user = EntitySchema('user', {
    //idAttribute: (data) => data.email,
    definition: ObjectSchema({})
});
const userList = ArraySchema(user);

function getUser(id) {
    faker.seed(+Hash(id));
    return Promise.resolve()
        .then(() => new Promise(resolve => setTimeout(resolve, Math.random() * 3000)))
        .then(() => ({
            id,
            name: faker.name.findName(),
            email: faker.internet.email(),
            job: faker.name.jobTitle()
        }))
    ;
}

const ApplicationSchema = ObjectSchema({
    user,
    userList
});

const {Provider, userItem, userError} = EntityApi(ApplicationSchema, {
    userItem: (id) => getUser(id).then(user => ({user})),
    userList: (idList) => Promise.all(idList.map(getUser)).then(userList => ({userList})),
    userError: () => getUser('foo').then(() => Promise.reject())
});

function LoadingBoundary(props) {
    return <div>{props.message.requestState
        .emptyMap(() => '...')
        .fetchingMap(() => 'Fetching...')
        .refetchingMap(() => 'Refetching...')
        .errorMap(() => 'Error!')
        .successMap(() => props.children(props.message.response))
        .value()}</div>;
}

function Print({children}) {
    return <pre>{JSON.stringify(children, null, 4)}</pre>;
}

function User({message}) {
    return <LoadingBoundary message={message}>
        {({user}) => <Print>{user}</Print>}
    </LoadingBoundary>;
}


function OnLoad() {
    const message = userItem.useRequest();
    useEffect(() => {message.onRequest('onLoad')}, []);
    return <LoadingBoundary message={message}>
        {({user}) => <Print>{user}</Print>}
    </LoadingBoundary>;
}

function OnPropChange() {
    const [id, setId] = useState('foo');
    return <div>
        <button onClick={() => setId('foo')}>foo</button>
        <button onClick={() => setId('bar')}>bar</button>
        <OnPropChangeRender id={id} />
    </div>
}
function OnPropChangeRender({id}) {
    const message = userItem.useRequest();
    useEffect(() => {message.onRequest(id);}, [id]);
    return <div>
        <button onClick={() => message.onRequest(id)}>refetch {id}</button>
        <LoadingBoundary message={message}>
            {({user}) => <Print>{user}</Print>}
        </LoadingBoundary>
    </div>;
}

function OnCallback() {
    const message = userItem.useRequest();
    return <div>
        <button onClick={() => message.onRequest('onCallback')}>fetch</button>
        <LoadingBoundary message={message}>
            {({user}) => <Print>{user}</Print>}
        </LoadingBoundary>
    </div>;
}

function List() {
    return ['a', 'b', 'c', 'd'].map(id => <OnPropChangeRender id={id} />);
}

function Series() {
    const foo = userItem.useRequest();
    const bar = userItem.useRequest();
    const baz = userItem.useRequest();
    useEffect(() => {
        foo.onRequest('foo@gmail.com')
            .then(({user}) => bar.onRequest(user.email))
            .then(({user}) => baz.onRequest(user.email));
    }, []);
    return <div>
        <User message={foo} />
        <User message={bar} />
        <User message={baz} />
    </div>;
}

function Parallel() {
    const foo = userItem.useRequest();
    const bar = userItem.useRequest();
    const baz = userItem.useRequest();
    useEffect(() => {
        foo.onRequest('foo');
        bar.onRequest('bar');
        baz.onRequest('baz');
    }, []);
    const message = foo.requestState.successFlatMap(() => bar.requestState.successFlatMap(() => baz.requestState));

    return <div>
        <LoadingBoundary message={{requestState: message}}>
            {() => <>
                <Print>{foo.response.user}</Print>
                <Print>{bar.response.user}</Print>
                <Print>{baz.response.user}</Print>
            </>}
        </LoadingBoundary>
    </div>;
}





function App() {
    return <Provider>
        <h1>Series</h1>
        <Series />


        <h1>Parallel</h1>
        <Parallel />

        <h1>On Load</h1>
        <OnLoad />

        <h1>On Prop Change</h1>
        <OnPropChange />

        <h1>On Callback</h1>
        <OnCallback />

        <h1>List</h1>
        <List />


    </Provider>;
}

ReactDOM.render(<App />, document.getElementById('app'));

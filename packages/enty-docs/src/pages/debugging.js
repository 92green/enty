// @flow
import React from 'react';
import MainLayout from '../components/MainLayout';
import {Wrapper, Box} from '../components/Layout';
import {ObjectSchema} from 'react-enty';
import {ArraySchema} from 'react-enty';
import {EntitySchema} from 'react-enty';
import {EntityApi} from 'react-enty';
import {LoadingBoundary} from 'react-enty';

var user = new EntitySchema('user');
var userList = new ArraySchema(user);

user.shape = new ObjectSchema({
    friendList: userList
});

const schema = new ObjectSchema({
    user,
    userList
});


const {Provider, userData, useRemove} = EntityApi({
    userData: (bool) => bool
        ? Promise.resolve({userList: [
            {id: 'foo', name: 'FooBar'},
            {id: 'bar', name: 'BarFoo'},
            {id: 'foo', lastName: 'Bar'},
            {id: 'bar', lastName: 'Baz!'}
        ]})
        : Promise.reject('Error!')
}, schema);

export default function Debugging() {
    return <Provider debug="Debugging Test">
        <MainLayout>
            <Wrapper>
                <UserAvatar />
            </Wrapper>
        </MainLayout>
    </Provider>;
}

function UserAvatar(props) {
    const userMessage = userData.useRequest();
    const remove = useRemove();


    return <Box>
        <Box>
            <button onClick={() => userMessage.request(true)}>Fetch Users</button>
            <button onClick={() => userMessage.request(false)}>Cause Error</button>
            <button onClick={() => remove('user', 'foo')}>Remove Foo</button>
        </Box>

        <LoadingBoundary message={userMessage} fallback={() => 'Loading'} error={() => 'Error'}>
            {(data) => console.log('inside') || <ol>{data.userList
                .map((ii, key) => <li key={key}>{ii.name} {ii.lastName}</li>)
            }</ol>}
        </LoadingBoundary>
    </Box>;
}

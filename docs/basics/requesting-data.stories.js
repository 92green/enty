// Storybook setup
export default {title: '1 Basics | Requesting Data'};

// Example begins here
import {Button, Spinner, Input, Box, Text, Message, Flex} from 'theme-ui';
import {get} from 'axios';
import {EntityApi, LoadingBoundary, EntitySchema, ObjectSchema, ArraySchema}  from 'react-enty';
import React, {useEffect, useState} from 'react';

// Define Schemas
const person = new EntitySchema('person', {id: data => data.name});
const personList = new ArraySchema(person);

const MainSchema = new ObjectSchema({
    personList,
    person
});

// Setup the api
const api = EntityApi({
    person: {
        list: async (payload) => {
            const {data} = await get(`https://swapi.dev/api/people/?page=${payload.page}`);
            return {personList: data.results};
        },
        get: async (payload) => {
            const {data} = await get(`https://swapi.dev/api/people/${payload.id}`);
            return {person: data};
        }
    }
}, MainSchema)


// Request personList on render
export const OnRender = api.ProviderHoc()(() => {
    const personListMessage = api.person.list.useRequest();

    useEffect(() => {
        personListMessage.request({page: 1});
    }, []);

    return <Box padding="3">
        <Message marginBottom="3">
            <Text>This example will fetch a list of people once when the component renders.</Text>
            <Text>Navigate away and back to see it fetch.</Text>
        </Message>
        <LoadingBoundary message={personListMessage} fallback={Spinner}>
            {({personList}) => {
                return <ul>
                    {personList.map(({name, birth_year}) => <li key={name}>
                        <Text as="span" fontWeight="bold">{name}</Text>
                        <Text as="span"> ({birth_year})</Text>
                    </li>)}
                </ul>
            }}
        </LoadingBoundary>
    </Box>
});

//
// Request a person based on an id
export const BasedOnId = api.ProviderHoc()(() => {

    const [id, setId] = useState(null);
    const personMessage = api.person.get.useRequest();

    // Request new data if `id` changes
    useEffect(() => {
        if(id) personMessage.request({id});
    }, [id]);


    return <Box margin="3">
        <Message marginBottom="3">
            <Text marginBottom="3">Fetch a single person based on changes to id.</Text>
            <Flex>
                <Button mr="2" onClick={() => setId(1)}>Load Luke</Button>
                <Button mr="2" onClick={() => setId(2)}>Load C-3PO</Button>
                <Button onClick={() => setId(3)}>Load R2-D2</Button>
            </Flex>
        </Message>
        <LoadingBoundary message={personMessage} fallback={Spinner}>
            {({person}) => <table>
                <tbody>
                    <tr><th>Name</th><td>{person.name}</td></tr>
                    <tr><th>Height</th><td>{person.height}</td></tr>
                    <tr><th>Mass</th><td>{person.mass}</td></tr>
                    <tr><th>Hair Color</th><td>{person.hair_color}</td></tr>
                    <tr><th>Skin Color</th><td>{person.skin_color}</td></tr>
                    <tr><th>Eye color</th><td>{person.eye_color}</td></tr>
                    <tr><th>Birth Year</th><td>{person.birth_year}</td></tr>
                    <tr><th>Gender</th><td>{person.gender}</td></tr>
                </tbody>
            </table>}
        </LoadingBoundary>
    </Box>
});


export const Callbacks = api.ProviderHoc()(() => {
    const personMessage = api.person.get.useRequest();

    return <Box margin="3">
        <Message marginBottom="3">
            <Text marginBottom="3">Request data directly via callback</Text>
            <Flex>
                <Button mr="2" onClick={() => personMessage.request({id: 1})}>Load Luke</Button>
                <Button mr="2" onClick={() => personMessage.request({id: 2})}>Load C-3PO</Button>
                <Button onClick={() => personMessage.request({id: 3})}>Load R2-D2</Button>
            </Flex>
        </Message>
        <LoadingBoundary message={personMessage} fallback={Spinner}>
            {({person}) => <table>
                <tbody>
                    <tr><th>Name</th><td>{person.name}</td></tr>
                    <tr><th>Eye color</th><td>{person.eye_color}</td></tr>
                    <tr><th>Birth Year</th><td>{person.birth_year}</td></tr>
                </tbody>
            </table>}
        </LoadingBoundary>
    </Box>
});


export const ParallelRequests = api.ProviderHoc()(() => {
    const luke = api.person.get.useRequest();
    const leia = api.person.get.useRequest();

    useEffect(() => {
        luke.request({id: 1});
        leia.request({id: 5});
    }, []);

    return <Box margin="3">
        <Message marginBottom="3">
            <Text>Request two people at the same time by creating two different messages.</Text>
        </Message>
        <LoadingBoundary message={luke} fallback={Spinner}>
            {({person}) => <Text>{person.name}</Text>}
        </LoadingBoundary>
        <LoadingBoundary message={leia} fallback={Spinner}>
            {({person}) => <Text>{person.name}</Text>}
        </LoadingBoundary>
    </Box>
});


export const SequentialRequests = api.ProviderHoc()(() => {
    const luke = api.person.get.useRequest();
    const leia = api.person.get.useRequest();

    useEffect(() => {
        if(luke.requestState.isEmpty) luke.request({id: 1});
        if(luke.requestState.isSuccess) leia.request({id: 5});
    }, [luke]);

    return <Box margin="3">
        <Message marginBottom="3">
            <Text>Request two people sequentially by checking the request state in useEffect</Text>
        </Message>
        <LoadingBoundary message={luke} fallback={Spinner}>
            {({person}) => <Text>{person.name}</Text>}
        </LoadingBoundary>
        <LoadingBoundary message={leia} fallback={Spinner}>
            {({person}) => <Text>{person.name}</Text>}
        </LoadingBoundary>
    </Box>
});


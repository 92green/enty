// Storybook setup
import {Button, Spinner, Input, Box, Text, Message, Flex} from 'theme-ui';
import {get} from 'axios';
import {EntityApi, LoadingBoundary, EntitySchema, ObjectSchema, ArraySchema}  from 'react-enty';
import React, {useEffect, useState} from 'react';
export default {title: '1 Basics | Custom Data Classes', component: Button};


export const Create = () => {

    // Define a person model with some extra data
    class Human {
        constructor(data) {
            this.name = data.name;
            this.mass = data.mass + 'kg';
        }
    }

    // Define a person schema whose shape is an object that
    // describes our Human model
    const person = new EntitySchema('person', {
        id: data => data.name,
        shape: new ObjectSchema({}, {
            create: data => new Human(data)
        })
    });
    // Our main schema is an array of people
    const MainSchema = new ArraySchema(person);

    // Setup the api. Enty can be of any shape. This one is a contrived example so
    // it is one method that returns an array.
    const Api = EntityApi({
        people: async (payload) => {
            const {data} = await get(`https://swapi.dev/api/people/?page=${payload.page}`);
            return data.results;
        }
    }, MainSchema)

    // Define a component that fetches and renders our Human models
    const PeopleList = () => {
        const peopleMessage = Api.people.useRequest();

        useEffect(() => {
            peopleMessage.request({page: 1});
        }, []);

        return <Box padding="3">
            <Message marginBottom="3">
                <Text>This example will use the ObjectSchema's create method to add custom properties as each person is normalized</Text>
            </Message>
            <LoadingBoundary message={peopleMessage} fallback={Spinner}>
                {(people) => <ul>
                    {people.map(({name, mass}) => <li key={name}>{name} weighs {mass}</li>)}
                </ul>}
            </LoadingBoundary>
        </Box>
    }

    // Make sure to wrap the component in a provider
    return <Api.Provider debug="create">
        <PeopleList />
    </Api.Provider>;

};


export const Merge = () => {

    // Create a person
    const person = new EntitySchema('people', {id: ii => ii.name});

    // Create an Entity:
    // 1. Who's shape is an array.
    // 2. Has a fixed id
    // 3. Defines a merge function to concat new entities
    const appendOnlyList = new EntitySchema('people', {
        id: () => 'peopleList',
        shape: new ArraySchema(person, {
            merge: (aa, bb) => aa.concat(bb)
        })
    });

    // Setup the api.
    const Api = EntityApi({
        people: async (payload) => {
            const {data} = await get(`https://swapi.dev/api/people/?page=${payload.page}`);
            return data.results;
        }
    }, appendOnlyList)

    // Define a component that fetches and renders our Human models
    // and has a button to keep fetching more to append
    const PeopleList = () => {
        const [page, setPage] = useState(1);
        const peopleMessage = Api.people.useRequest({key: 'peopleList'});

        useEffect(() => {
            fetchMorePeople();
        }, []);

        const fetchMorePeople = () => {
            peopleMessage.request({page});
            setPage(page + 1);
        };

        const {isFetching, isRefetching} = peopleMessage.requestState;
        const buttonText = isFetching || isRefetching ? 'Fetching...' : 'Fetch more people';

        return <Box padding="3">
            <Message marginBottom="3">
                <Text>We can use ArraySchema's merge function to append to a list on each request</Text>
            </Message>
            <Button onClick={fetchMorePeople}>{buttonText}</Button>
            <ul>{(peopleMessage.response || []).map(({name}) => <li key={name}>{name}</li>)}</ul>
        </Box>
    }

    // Make sure to wrap the component in a provider
    return <Api.Provider debug="create">
        <PeopleList />
    </Api.Provider>;

};


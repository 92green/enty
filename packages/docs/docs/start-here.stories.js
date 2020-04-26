// Setup
import React, {useEffect, useState} from 'react';
import Markdown from 'react-markdown/with-html';
import {Button, Spinner, Input, Box, Text, Message, Flex} from 'theme-ui';
import {get} from 'axios';
import {EntityApi, LoadingBoundary, EntitySchema, ObjectSchema, ArraySchema}  from 'react-enty';

export default {title: '0 Introduction | Start Here'};


// Examples Start Here

export const WhatIsEnty = () => <Box padding="3"><Markdown source={`

# What is Enty?

Enty is a normalized cache for front-ends designed to synchronized local state with an external source like a database.

* It's declarative. (Designed for hooks)
* It keeps your data up to date.
* It's low boiler plate.
* It works with promises, async generators and observables.

`} /></Box>;


export const AboutTheseDocs = () => <Box padding="3"><Markdown source={`

# About these docs

More than one person has said it took them a while to understand the whole of Enty. Because of that I opted to use Storybook so you could see everything that goes into each example.   want these docs to be interactive and give you as much real code as they can. The idea is that you can see the finished outcome on the left, and view the annotated code that constructed that on the right. Most of the actual descriptions are in the code examples.

Caveat: Due to Storybook being a component playground there were some workarounds required to keep all the conde in each story, and you should consider each as a fresh react project. In your code please declare your schemas and API at the root level, not in your component heirachy.

`} /></Box>;


export const JustGiveMeTheCode = () => {

    // EntitySchema.js

    // Define a person schema that has a name and tells enty how to identify it
    const person = new EntitySchema('person', {id: data => data.name});

    // Define the schema for an array of people
    const personList = new ArraySchema(person);

    // Define our main schema as an object with people and person on it.
    // Think of this like the graphql root resolver
    const MainSchema = new ObjectSchema({
        personList,
        person
    });

    ////////////////////

    // EntityApi.js

    // Create an api by binding our schema to data fetching functions.
    // Functions can return promises, observables or async generators.
    // They can be nested to any level for organisiation.
    const Api = EntityApi({
        person: {
            list: async (payload) => {
                const {data} = await get(`https://swapi.dev/api/people/?page=${payload.page}`);
                return {personList: data.results};
            }
        }
    }, MainSchema)

    ///////////////////

    // App.js

    const App = () => {
        // Create an new message from our api.
        // Messages contain all the information we need to fetch data
        // and safely render it
        const personListMessage = Api.person.list.useRequest();

        // useEffect hook starts the person list request on render
        useEffect(() => {
            personListMessage.request({page: 1});
        }, []);

        // LoadingBoundary takes and message and will
        // fallback to Spinner while it is fetching
        return <Box padding="3">
            <LoadingBoundary message={personListMessage} fallback={Spinner}>
                {({personList}) => {
                    // data in the shape of our main schema is given
                    // render props to the function
                    return <ul>
                        {personList.map(({name, birth_year}) => <li key={name}>
                            <Text as="span" fontWeight="bold">{name}</Text>
                            <Text as="span"> ({birth_year})</Text>
                        </li>)}
                    </ul>
                }}
            </LoadingBoundary>
        </Box>
    }

    // Wrap our app in the Api's provider to make sure we have access to state
    // This would normally be ReactDOM.render(<Api.Provider>...</Api.Provider>, domNode);
    return <Api.Provider>
        <App />
    </Api.Provider>;
};

export const TodoApp = () => {
    return <div>Todo</div>
}

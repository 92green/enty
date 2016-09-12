import React from 'react';
import ReactDOM from 'react-dom';
import {createEntityReducer} from 'redux-blueflag';
import thunk from 'redux-thunk'
import {Provider} from 'react-redux';
import {compose, createStore, applyMiddleware, combineReducers} from 'redux';
import Playground from './components/Playground';


//
// Schemas
//

import {Schema, arrayOf} from 'redux-blueflag';

var SubredditSchema = new Schema('subreddit', {idAttribute: 'fullnameId'});
var AuthorSchema = new Schema('author', {idAttribute: 'fullnameId'});
var TopListingSchema = new Schema('topListings', {idAttribute: 'fullnameId'});

TopListingSchema.define({
    author: AuthorSchema
});

SubredditSchema.define({
    topListings: arrayOf(TopListingSchema)
});

const EntitySchema = {
    subreddit: SubredditSchema
}

//
// reducer
//

var reducers = combineReducers({
    entity: createEntityReducer({
        mainSchema: EntitySchema,
        GRAPHQL_RECEIVE: EntitySchema
    })
});

// store
var store = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducers);

//
// Render Town
//
ReactDOM.render((
    <div>
        <Provider store={store}>
            <Playground/>
        </Provider>
    </div>
), document.getElementById('app'));

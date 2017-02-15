# Introduction
redux-blueflag is a framework for managing data requested from back-ends and APIs.  Instead of you manually storing requested data, redux blueflag uses schemas to describe relationships and stores the data as normalised entities. 

* Views can declare what data they need. 
* There is practically no data fetching code. 
* Data given to views is always up to date.
* Bad relationships in data become clear.
* pairs wonderfully with graphql

Redux-blueflag is built on [redux] and [normalizr].

# Purpose

<!-- ## models -->
Any webapp that involves  both a back and a front end will create entities. Unique pieces of data that are known by and id.  The back end might call them models, the front end might call them application state, lets call them entities. 

<!-- ## too much handling of the data -->
When the client side thinks of storing these entities in terms of endpoints and stores (or even actions and reducers) it's another set of hands touching the data. It allows more places for shady hacks to creep in. It allows more places for code to become brittle. It allows more places for the code to break. 

On top of this you force the front end to recreate releationships between entities. Storing data by type in isolated stores logically makes sense, but when a view visually combines two entities (post with comments) you create a point where the front end needs to know exactly how to reconstruct this. This is not an insurmountable problem but as the code base grows so do the places where the front end has to know some specific detail the more places things go wrong. 

<!-- ## front end concerns.  -->
In reality the front end doesn't care where the data came from or how it is stored. It just knows that it wants a certain number of entities and have they arrived yet. 

<!-- ## redux blueflag -->
Redux blueflag lets you describe the relationships of your entities through schemas. It is then able to store them in a normalised state. This means that they are not stored by request but by the unique id that they were given by the db. 



# getting started

## schema
 The first step in implementing redux blueflag is to define your normalizr schema. This defines what relationships your entities have. A user might have a list of friends which are also users. So we can define that as a user 

``` 
user.define({
 	friendList: arrayOf(user)
});
```

## API
A large part of connecting redux to a back end is the creation of request actions. Entities need to be requested and actions need to be triggered for request, receive and error states. Redux blueflag provides a function to abstract the creation of these actions allowing you to just declare where each entity is located. 

```
CreateRequestActionSet({
	user: {
		list: () => request.get(`/api/user/`),
		get: id => request.get(`/api/user/${id}`)
	}
});
```

This will create an object with

requestUserList()
requestUserGet()
USER_LIST_FETCH
USER_LIST_RECEIVE
USER_LIST_ERROR
USER_GET


## reducer

The next thing we need to do is to create our entity reducer. This will store all our entity state and is where we define which actions will be normalized. 


```
import EntitySchema from './EntitySchema';

CombineReducers({
	entity: createEntityReducer({
		ENTITY_RECEIVE: EntitySchema
	})
})
```

We've just created out reducer in redux and said that results returned from the action type `ENTITY_RECEIVE` should be normalized using the root schema.

We can add other action types and schemas if other relationships are required. Say we had a restful endpoint that returned a list of users. we could create a schema as follows to normalize the list that returns. 

```
import EntitySchema from './EntitySchema';

CombineReducers({
	entity: createEntityReducer({
		ENTITY_RECEIVE: EntitySchema,
		USER_LIST_RECEIVE: EntitySchema.userList
	})
})
```


## requests 


## constructing entities. 
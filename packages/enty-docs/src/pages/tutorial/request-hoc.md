---
id: RequestHoc
title: Request Hoc
---
_This is an introductory description of the RequestHoc. For specific details of
their types and methods check the [Api](/docs/data/RequestHoc)._

Request Hoc is used to bind API functions to react views.

When a component is wrapped with a RequestHoc it will be given a [Message] at `props.${name}` This
contains all the necessary tools to request the data and render something when it returns.

## Configure a RequestHoc
Each request hoc requires a name prop, all the data associated with that request will be stored 
on a props of that name. This lets you stack up multiple requests without having to 
worry about namespace collisions.

```js
composeWith(
    UserRequestHoc({
        name: 'userMessage',
    }),
    PetRequestHoc({
        name: 'petMessage'
    }),
    UserPetComponent
);
```

## What's in a Message?

### RequestState
One of Enty's core goals is to be a declarative state management library. Because of this Enty uses 
a variant pattern to declare hold the current state of each request.

This pattern lets you declare upfront what should happen at each state and stops you writing adhoc 
and complicated null/boolean tests to check if your data has arrived.


```jsx
function User({userMessage}) {
    const {requestState} = userMessage;
    const {response} = userMessage;
    const {requestError} = userMessage;
    return requestState
        .fetchingMap(() => <Loader/>)
        .refetchingMap(() => <Loader/>)
        .successMap(() => <Box>{response.user.name}</Box>)
        .errorMap(() => <Error error={requestError}/>)
        .value();
}
```

See more: [ApplyLoader], [LoadingHoc], [Merging RequestStates]


### Response
When the request is successful the entities matching your request will be available in the 
message's response. The response data is stored here rather than props to stop name space collisions 
between other messages and hocs. You can use the [get] and [getIn] functions for easy access to the
response.

```js
function User({userMessage}) {
    return userMessage.requestState
        .successMap(() => userMessage.getIn(['user', 'email']))
        .value()
}
```

If this becomes a hassle you can use the `config.mapResponseToProps` to hoist the data out of the 
message.

```jsx
// Flatten the whole response object to props
const withData = RequestHoc({
    name: 'userMessage',
    mapResponseToProps: response => response
});

// Map a single prop
const withData = RequestHoc({
    name: 'userMessage',
    mapResponseToProps: response => ({data: response.userItem})
});

```



### OnRequest
Each message is given an onRequest callback that is bound to the promise declared in the api.
Calling the onRequest will call the api function and return a promise that will either contain 
the next normalized response or the request's error.

```
function SaveUser({saveMessage}) {
    return <button
        onClick={() => saveMessage.onRequest(newUser)}
        children="Save"
    />;
}
```


### RequestError
If the promise declared in the API rejects, `requestError` will contain that caught error. 

```jsx
function User({userMessage}) {
    const {requestState} = userMessage;
    const {requestError} = userMessage;

    return requestState
        .errorMap(() => <div>{requestError.message}</div>)
        .value();
}
```








## Examples

### Automatically request data
A common use case for any application is to request data immediately when page renders, show a 
loader and render something when the data has successfully returned. 

```jsx
import {UserItemRequestHoc} from './EntityApi';

function User({userMessage}) {
    const {requestState} = userMessage;
    const {response} = userMessage;
    const {requestError} = userMessage;

    return requestState
        .fetchingMap(() => <Loader />)
        .refetchingMap(() => <Loader />)
        .errorMap(() => <Error errorData={requestError} />)
        .successMap(() => <div>My name is: {response.user.name}</div>)
        .value();
}

const withUser = UserItemRequestHoc({
    auto: true,
    name: 'userMessage'
});
const UserWithData = withUser(User);
```


### Responding to changes in props
If you need to re-request data when a prop changes you can supply an array of key paths to 
`config.auto` and it will re trigger the request when those props change.

```jsx
const withUser = UserRequestHoc({
    auto: ['userId'],
    name: 'user'
});
const UserWithData = withUser(User);
```


### Request data with a callback
Sometimes you might need to request data via a callback. If you do not set the auto option no
requests will be made until you trigger the `props.${name}.onRequest` callback.

```jsx
import {UserItemRequestHoc} from './EntityApi';

function RequestUserButton({userMessage, userId}) {
    const {onRequest} = userMessage;
    const {requestState} = userMessage;

    return <button onClick={() => onRequest({userId})}>
        {requestState
            .fetchingMap(() => 'Fetching user...')
            .refetchingMap(() => 'Fetching user again...')
            .errorMap(() => 'Fetching user did not work.')
            .successMap(() => 'User fetched!')
            .value()}
    </button>
}

const withUser = UserItemRequestHoc({name: 'userMessage'});
const UserWithData = withUser(User);
```



### Chaining multiple requests together
OnRequest callbacks always return a promise and the normalizing flow is triggered after each one 
resolves. Because of this it is easy to chain multiple requests together and render your app 
accordingly.


```js
import {UserRequestHoc} from './EntityApi';
import {PetsRequestHoc} from './EntityApi';

class RequestUserWithPetButton extends Component {
    onRequest() {
        const {userMessage} = this.props;
        const {petMessage} = this.props;
        const {userId} = this.props;

        userMessage.onRequest({userId})
            .then(({user}) => petMessage.onRequest({petId: user.pet.id}));
    }
    render() {
        const {requestState} = props.user;

        return <button onClick={this.onRequest}>
            {requestState
                .fetchingMap(() => 'Fetching user and pet...')
                .refetchingMap(() => 'Fetching user and pet again...')
                .errorMap(() => 'Fetching user and pet did not work.')
                .successMap(() => 'User and pet fetched!')
                .value()}
        </button>;
    }
}

const UserWithData = composeWith(
    UserRequestHoc({name: 'userMessage'}),
    PetRequestHoc({name: 'petMessage'}),
    RequestUserWithPetButton
);

```

### Combining multiple requests into one

Sometimes it's useful to mix a couple of requests together. The [Message] lets you create a 
new [Message] object based on the result of a promise-returning callback derived from props.

In the below example we apply a pet and user hock, then use a [MultiRequestHoc] to 
combine both EntityRequesters into a single message object. This gives us a single `requestState`
but still allows us to get the data from the user and pet messages individually.


```js
import {UserRequestHoc} from './EntityApi';
import {PetRequestHoc} from './EntityApi';

class RequestUserButton extends Component {
    render() {
        const {userId} = this.props;
        const {requestState} = props.userAndPetMessage;
        const {onRequest} = props.userAndPetMessage;

        return <button onClick={() => onRequest({userId})}>
            {requestState
                .fetchingMap(() => 'Fetching user and pet...')
                .refetchingMap(() => 'Fetching user and pet again...')
                .errorMap(() => 'Fetching user and pet did not work.')
                .successMap(() => 'User and pet fetched!')
                .value()}
        </button>;
    }
}


export default composeWith(
    UserItemRequestHoc({name: 'userMessage'}),
    UserItemRequestHoc({name: 'petMessage'}),
    MultiRequestHoc({
        name: 'userAndPetMessage'
        auto: ['userId'],
        onRequest: (props) => props.userMessage.onRequest()
            .then(props.petMessage.onRequest)
    }),
    RequestUserButton
);
```

[Message]: /docs/data/Message
[ApplyLoader]: /docs/data/RequestState#applyloader
[LoadingHoc]: /docs/data/RequestState#loadinghoc
[Merging RequestStates]: /docs/data/RequestState#merging-requeststates

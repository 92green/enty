prop data
import Doclet from '../components/Doclet';
import TypeLink from '../components/TypeLink';
import {Typography} from 'goose-css';

<Doclet showDescription={false} node={data.RequestHock}/>

RequestHockConfig

<Doclet primary={true} showName={false} showKind={false} showDescription={false} node={data.RequestHockConfig}/>


<Typography>
<markdown>

Request Hock is used to bind API functions to react views.

When a component is hocked with a RequestHock it will be given a <TypeLink name="Message" /> object at `props.${name}` This object contains all the necessary tools to request data and render something when it comes back.


## Automatically request data
A common use case for any application is to request data immediately when page renders, show a loader and render something when the data has successfully returned. 

```jsx
import {UserItemRequestHock} from './EntityApi';

function User(props) {
    const {requestState} = props.user;
    const {payload} = props.user;
    const {requestError} = props.user;

    return requestState
        .fetchingMap(() => <Loader />)
        .refetchingMap(() => <Loader />)
        .errorMap(() => <Error errorData={requestError} />)
        .successMap(() => <div>My name is: {payload.userItem.name}</div>)
        .value();
}

const withUser = UserItemRequestHock({
    auto: true,
    name: 'user'
});
const UserWithData = withUser(User);
```


### Responding to changes in props
If you need to re-request data when a prop changes you can supply an array of key paths to `config.auto`
and it will re trigger the request when those props change.

```jsx
const withUser = UserItemRequestHock({
    auto: ['userId'],
    name: 'user'
});
const UserWithData = withUser(User);
```


## Request data with a callback
Sometimes you might need to request data on via a callback. If you do not set the auto option no
requests will be made until you trigger the `props.${name}.onRequest` callback.

```jsx
import {UserItemRequestHock} from './EntityApi';

function RequestUserButton(props) {
    const {userId} = this.props
    const {onRequest} = props.user;
    const {requestState} = props.user;

    return <button onClick={() => onRequest({userId})}>
        {requestState
            .fetchingMap(() => 'Fetching user...')
            .refetchingMap(() => 'Fetching user again...')
            .errorMap(() => 'Fetching user did not work.')
            .successMap(() => 'User fetched!')
            .value()}
    </button>
}

const withUser = UserItemRequestHock({name: 'user'});
const UserWithData = withUser(User);
```



## Chaining multiple requests together
OnRequest callbacks always return a promise and the normalizing flow is triggered after each one resolves. 
Because of this it is easy to chain multiple EntityRequesters together and render your app accordingly.


```js
import {UserItemRequestHock} from './EntityApi';
import {PetsItemRequestHock} from './EntityApi';
import MultiRequestHock from 'react-enty/lib/MultiRequestHock';

class RequestUserButton extends Component {
    onRequest() {
        const {user} = this.props;
        const {pet} = this.props;
        const {userId} = this.props;

        user.onRequest({userId})
            .then(({userItem}) => pet.onRequest({petId: userItem.pet.id}));
    }
    render() {
        const {requestState} = props.user;

        return <button onClick={this.onRequest}>
            {requestState
                .fetchingMap(() => 'Fetching user and pet...')
                .refetchingMap(() => 'Fetching user and pet again...')
                .errorMap(() => 'Fetching user and pet did not work.')
                .successMap(() => 'User fetched!')
                .value()}
        </button>;
    }
}

const withUser = UserItemRequestHock({name: 'user'});
const withPet = UserItemRequestHock({name: 'pet'});
const UserWithData = withUser(withPet(User));

```

## Combining multiple requests into one

Sometimes it's useful to mix a couple of requests together. The <TypeLink name="MultiRequestHock" /> lets you create a 
new <TypeLink name="Message" /> object based on the result of a promise-returning callback derived from props.

In the below example we apply a pet and user hock, then use a <TypeLink name="MultiRequestHock" /> to 
combine both EntityRequesters into a single message object. This gives us a single `requestState`
but still allows us to get the data from the user and pet messages individually.


```js
import {UserItemRequestHock} from './EntityApi';
import {PetsItemRequestHock} from './EntityApi';

class RequestUserButton extends Component {
    render() {
        const {requestState} = props.userAndPet;
        const {onRequest} = props.userAndPet;

        return <button onClick={onRequest}>
            {requestState
                .fetchingMap(() => 'Fetching user and pet...')
                .refetchingMap(() => 'Fetching user and pet again...')
                .errorMap(() => 'Fetching user and pet did not work.')
                .successMap(() => 'User and pet fetched!')
                .value()}
        </button>;
    }
}

const withUser = UserItemRequestHock({name: 'user'});
const withPet = UserItemRequestHock({name: 'pet'});
const withRequest = MultiRequestHock({
    name: 'userAndPet'
    auto: ['userId'],
    onRequest: (props) => props.user.onRequest()
        .then(props.pet.onRequest)
});
const UserWithData = withUser(withPet(withRequest(User)));

```

</markdown>
</Typography>




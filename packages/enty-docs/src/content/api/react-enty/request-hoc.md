---
title: RequestHoc
group: React Enty
---

The RequestHoc is a hoc version of useRequest. It has a slightly different api, but under the hood is just useRequest.

```flow
RequestHock({
    name: string,
    auto?: boolean|Array<string>,
    payloadCreator?: (props: *) => *,
    shouldComponentAutoRequest?: (props: *) => boolean
})(Component);
```


## Config

### .name
**type:** `string`  
**required:** `true`  

The name of the prop to pass the [Message] down through.

```js
const withUser = UserGetHoc({name: 'userMessage'});
```

### .auto
**type:** `boolean|Array<string>`  

Automatically request data on component mount or if a prop changes.

If `config.auto` is set to true the api function will be called immediately whenever the component mounts.
This is useful for upfront fetching of a pages data.

If `config.auto` is set to an array of strings that match to prop names the api function will be called 
immediately on component mount, and everytime one of those props changes.
This is useful for fetching data in a component that changes often.

If `config.auto` is not declared nothing will happen until the `request` callback is fired.
This is useful for mutations triggered by user interaction like save, update or delete.

```js
// Request the user on component mount
UserGetHoc({
    name: 'userMessage', 
    auto: true
});

// Request the user on component mount and when the userId prop changes
UserGetHoc({
    name: 'userMessage',
    auto: ['userId']
});
```


### .payloadCreator
**type:** `(props|payload) => *`  

The payload creator is used to generate a unique key to keep track of your requests. The result is 
hashed and stored in Enty state. This means a single RequestHoc can query different types of the 
same data and Enty is able to cache the results.

* If `auto` is truthy props are passed to `payloadCreator`.
* Calls to `message.request` are passed directly to `payloadCreator`.


```js
// Auto request different users from react router params
UserGetHoc({
    name: 'userMessage', 
    auto: ['match.params.id'],
    payloadCreator: (props) => ({
        id: props.match.params.id
    })
});
```

### .shouldComponentAutoRequest
**type:** `(props) => boolean`  

If auto requesting is enabled, this hook lets you cancel the request based on props.



## Examples

### Fetch On Load
```js
api.user.requestHoc({
    name: 'userMessage', 
    auto: true,
    payloadCreator: (props) => ({id: props.id})
});
```

### Fetch On Prop Change
```js
api.user.requestHoc({
    name: 'userMessage', 
    auto: ['match.params.id'],
    payloadCreator: ({match}) => ({id: match.params.id})
});
```

### Fetch On Callback
```jsx
composeWith(
    api.saveUser.requestHoc({
        name: 'saveMessage', 
        payloadCreator: (payload) => payload
    }),
    (props) => {
        const {payload, saveMessage} = props;
        return <button onClick={() => message.request(payload)}>save user</button>
    }
);
```

### Fetch Series
```jsx
// Contrived example
composeWith(
    api.foo.requestHoc({name: 'foo'}),
    api.bar.requestHoc({name: 'bar'}),
    class Test extends React.Component<{aa: Message, bb: Message}> {
        componentDidMount() {
            const {foo, bar} = this.props;
            foo.request('first').then(() => bar.request('second'));
        }
        render() {
            const {aa, bb} = this.props;
            return <div>
                <ExpectsMessage message={aa} />
                <ExpectsMessage message={bb} />
            </div>;
        }
    }
);
```

### Fetch Parallel
```jsx
composeWith(
    api.foo.requestHoc({name: 'foo', auto: true}),
    api.bar.requestHoc({name: 'bar', auto: true}),
    MyComponent
);
```

[Message]: /api/react-enty/Message


---
title: useRequest
group: React Enty
---

The useRequest hook is the way api functions are bound to your components.

It returns a [Message] that contains all the necessary tools to request data and render something when it comes back. The hook handles the normalizing and denormalizing of the data so that you only need to worry about what data you want and when you want to ask for it.

```flow
useRequest(): Message
```

## Examples
### Fetch On Load

```jsx
import {useEffect} from 'react';
import api from './api';
import Spinner from ./components/Spinner';
import Error from ./components/Error';

export default function Avatar(props) {
    const message = api.user.useRequest();
    useEffect(() => {
        message.onRequest({id: props.id});
    }, []);

    return <LoadingBoundary message={message} fallback={<Spinner/>} error={<Error />}>
        {({user}) => <img src={user.avatar} alt={user.name} />}
    </LoadingBoundary>
}
```

### Fetch On Prop Change
```jsx
import {useEffect} from 'react';
import api from './api';
import Spinner from ./components/Spinner';
import Error from ./components/Error';

export default function Avatar(props) {
    const message = api.user.useRequest();
    useEffect(() => {
        message.onRequest({id: props.id});
    }, [props.id]);

    return <LoadingBoundary message={message} fallback={<Spinner/>} error={<Error />}>
        {({user}) => <img src={user.avatar} alt={user.name} />}
    </LoadingBoundary>
}
```

### Fetch On Callback
```jsx
import {useEffect} from 'react';
import {useState} from 'react';
import api from './api';
import Spinner from ./components/Spinner';
import Error from ./components/Error';

export default function Avatar(props) {
    const [id, setId] = useState();
    const message = api.user.useRequest();

    return <Box>
        <input value={id} onChange={(e) => setId(e.value)} />
        <button onClick={() => message.onRequest({id})}>Fetch User</button>
        <LoadingBoundary message={message} fallback={<Spinner/>} error={<Error />}>
            {({user}) => <img src={user.avatar} alt={user.name} />}
        </LoadingBoundary>
    </Box>
}
```

### Fetch Series

```jsx
import {useEffect} from 'react';
import api from './api';
import Spinner from ./components/Spinner';
import Error from ./components/Error';

export default function Avatar(props) {
    const foo = api.user.useRequest();
    const bar = api.user.useRequest();
    const loadingProps = {fallback: <Spinner />, error: <Error />};
    const renderUser = {({user}) => <img src={user.avatar} alt={user.name} />}
    
    useEffect(() => {
        let fetch = async () => {
            await foo.onRequest('foo');
            await bar.onRequest('bar');
        }
        fetch();
    }, [])

    return <Box>
        <LoadingBoundary message={foo} {...loadingProps} />{renderUser}</LoadingBoundary>
        <LoadingBoundary message={bar} {...loadingProps} />{renderUser}</LoadingBoundary>
    </Box>
}

```

### Fetch Parallel

```jsx
import {useEffect} from 'react';
import api from './api';
import Spinner from ./components/Spinner';
import Error from ./components/Error';

export default function Avatar(props) {
    const foo = api.user.useRequest();
    const bar = api.user.useRequest();
    const loadingProps = {fallback: <Spinner />, error: <Error />};
    const renderUser = {({user}) => <img src={user.avatar} alt={user.name} />}
    
    useEffect(() => {
        foo.onRequest('foo');
        bar.onRequest('bar');
    }, [])

    return <Box>
        <LoadingBoundary message={foo} {...loadingProps} />{renderUser}</LoadingBoundary>
        <LoadingBoundary message={bar} {...loadingProps} />{renderUser}</LoadingBoundary>
    </Box>
}
```

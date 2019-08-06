import {EntityApi, ArraySchema, EntitySchema, ObjectSchema} from 'react-enty';
import React from 'react';
//import ReactDOM from 'react-dom';
//window.React2 = ReactDOM;
//console.log('WINDOW',  window.React1 === window.React2);

//const Child = () => {
    ////const message = foo.useRequest();
    ////const remove = useRemove();

    ////useEffect(() => {
        ////message.onRequest();
    ////}, []);

    //return <div>
        //<button className="remove" onClick={() => console.log('foo', 'b')} />
    //</div>;
//};

const response = [{id: 'a'}, {id: 'b'}, {id: 'c'}];
const {Provider} = EntityApi(
    {
        foo: () => Promise.resolve(response)
    },
    new ArraySchema(new EntitySchema('foo', {shape: {}}))
);

export default function App() {
    return <Provider>woot</Provider>;
}



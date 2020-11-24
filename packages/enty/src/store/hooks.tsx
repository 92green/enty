import React, {useEffect, useState, useCallback} from 'react';
import {EntitySchema} from '../index';
import {Meta, Respond} from '../store/Store';
import Store from '../store/Store';

export const Context = React.createContext<Store | undefined>(undefined);
export const Provider = ({store, ...rest}: {store: Store}) => (
    <Context.Provider value={store} {...rest} />
);

export function useStore() {
    const store: Store | undefined = React.useContext(Context);
    if (!store) {
        throw new Error('No Enty Provider found');
    }
    return store;
}

export function useEntity(config: {
    schema: EntitySchema<any>;
    id: string;
    loadData?: any;
    shouldSubscribe?: boolean;
    respond?: Respond;
}): [any, Meta, Function] {
    const {schema, id, loadData = {}, shouldSubscribe = true, respond} = config;
    const store = useStore();
    const [stateTuple, setState] = useState([null, {}]);

    const onSave = useCallback(
        (saveData) => {
            store.trigger({schema, id, method: 'save', saveData});
        },
        [schema, id]
    );

    useEffect(() => {
        if (!shouldSubscribe) return;
        return store.subscribe({schema, id, method: 'load', loadData, respond}, setState);
    }, [schema, id, JSON.stringify(loadData), shouldSubscribe]);

    return [stateTuple[0], stateTuple[1], onSave];
}

export function useEntityList(config: {
    schema: EntitySchema<any>;
    respond?: Respond;
}): Array<[any, Meta]> {
    const {schema} = config;
    const store = useStore();
    const [entityTupleList, setState] = useState([]);

    useEffect(() => {
        return store.subscribe({schema, method: 'list'}, setState);
    }, [schema]);

    return [entityTupleList];
}

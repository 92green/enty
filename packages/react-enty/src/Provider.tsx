import React, {useContext, useEffect, useState, FunctionComponent, Context} from 'react';
import {EntityStore} from 'enty-state';

export type StoreContext = {};
export const StoreContext: Context<StoreContext> = React.createContext({});
export const useStore = () => useContext(StoreContext);

type Props = {
    children: Element;
    debug?: string;
    store: EntityStore<any>;
};

export const Provider: FunctionComponent<Props> = ({children, debug, store}) => {
    const [value, setState] = useState({store});

    useEffect(() => {
        store.subscribe(() => {
            if (debug) console.log(store);
            setState({store});
        });
    }, []);

    return <StoreContext.Provider children={children} value={value} />;
};

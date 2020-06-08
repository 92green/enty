import React, {useContext, Context} from 'react';
import {EntityStore} from 'enty-state';

export const StoreContext: Context<{
    count: number;
    store: EntityStore<any> | null;
}> = React.createContext({count: 0, store: null});
export const useStore = () => useContext(StoreContext);

// @flow
import removeAction from './api/removeAction';
import {useContext, useMemo} from 'react';


export default function RemoveHookFactory(context: *) {
    return () => {
        const store = useContext(context);
        if(!store) throw 'useRemove must be called in a provider';
        const [state, dispatch] = store;

        return useMemo(() => (type: string, id: string) => {
            dispatch(removeAction(type, id));
        }, [state]);

    };
}

// @flow
import removeAction from 'enty-state/lib/api/removeAction';
import {useContext, useMemo} from 'react';


export default function RemoveHookFactory(context: *) {

    return () => {
        const store = useContext(context);
        if(!store) throw 'useRemove must be called in a provider';
        const [state, dispatch] = store;

        return useMemo(() => (type, id) => {
            return dispatch(removeAction(type, id));
        }, [state]);

    };
}

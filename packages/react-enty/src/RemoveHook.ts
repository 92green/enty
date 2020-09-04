import removeAction from 'enty/lib/state/removeAction';
import {Context} from 'react';
import {useContext, useMemo} from 'react';
import {ProviderContext} from './ProviderFactory';

export default function RemoveHookFactory(context: ProviderContext) {
    return () => {
        const store = useContext(context);
        if (!store) throw 'useRemove must be called in a provider';
        const [state, dispatch] = store;

        return useMemo(
            () => (type: string, id: string) => {
                dispatch(removeAction(type, id));
            },
            [state]
        );
    };
}

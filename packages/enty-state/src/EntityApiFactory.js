//@flow

import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';


type ActionMap = {
    [key: string]: *
};

type Visitor = ({actionType: string, requestAction: Function, generateResultKey: Function}) => *;

export default function EntityApiFactory(actionMap: ActionMap, visitor: Visitor) {
    return visitActionMap(actionMap, (sideEffect, path) => {
        const actionType = path.join('_').toUpperCase();
        const requestAction = createRequestAction(sideEffect);

        return visitor({
            actionType,
            requestAction,
            generateResultKey: (payload) => Hash({payload, actionType})
        });
    });
}


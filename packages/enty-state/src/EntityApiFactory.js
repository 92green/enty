//@flow

import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';
import resetAction from './api/resetAction';


type ActionMap = {
    [key: string]: *
};

type Visitor = ({
    actionType: string,
    requestAction: Function,
    resetAction: Function,
    generateResultKey: Function
}) => *;

export default function EntityApiFactory(actionMap: ActionMap, visitor: Visitor) {
    return visitActionMap(actionMap, (sideEffect, path) => {
        const actionType = path.join('_').toUpperCase();
        const requestAction = createRequestAction(sideEffect);

        return visitor({
            actionType,
            requestAction,
            resetAction,
            generateResultKey: (payload) => Hash({payload, actionType})
        });
    });
}


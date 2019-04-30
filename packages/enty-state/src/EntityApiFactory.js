//@flow
import type {Schema} from 'enty/lib/util/definitions';

import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';

import set from 'unmutable/lib/set';
import pipeWith from 'unmutable/lib/util/pipeWith';

type ActionMap = {
    [key: string]: *
};

type Visitor = ({actionType: string, requestAction: Function, generateResultKey: Function}) => *;

export default function EntityApiFactory(actionMap: ActionMap, visitor: Visitor) {
    return visitActionMap(actionMap, (sideEffect, path) => {
        const actionType = path.join('_').toUpperCase();
        const requestAction = createRequestAction(actionType, sideEffect);

        return visitor({
            actionType,
            requestAction,
            generateResultKey: (payload) => Hash({payload, actionType})
        });
    });
}


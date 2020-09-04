import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';
import resetAction from './api/resetAction';
import removeEntityAction from './api/removeAction';
import {SideEffect} from './util/definitions';

console.log('!!!!', {createRequestAction, resetAction, removeEntityAction});

type ActionMap = Record<string, any>;

type Visitor = (arg0: {
    actionType: string;
    requestAction: Function;
    resetAction: Function;
    removeEntityAction: Function;
    generateResultKey: Function;
}) => any;

export default function EntityApiFactory(actionMap: ActionMap, visitor: Visitor) {
    return visitActionMap(
        actionMap,
        <A extends SideEffect, B extends string[]>(sideEffect: A, path: B) => {
            const actionType = path.join('_').toUpperCase();
            const requestAction = createRequestAction(sideEffect);

            return visitor({
                actionType,
                requestAction,
                resetAction,
                removeEntityAction,
                generateResultKey: <A>(payload: A) => Hash({payload, actionType})
            });
        }
    );
}

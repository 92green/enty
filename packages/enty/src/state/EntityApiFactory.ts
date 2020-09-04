import Hash from './Hash';
import visitActionMap from './visitActionMap';
import createRequestAction from './createRequestAction';
import resetAction from './resetAction';
import removeEntityAction from './removeAction';
import {SideEffect} from './definitions';

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

import Hash from './util/Hash';
import visitActionMap from './api/visitActionMap';
import createRequestAction from './api/createRequestAction';
import resetAction from './api/resetAction';
import removeEntityAction from './api/removeAction';

type ActionMap = {
    [key: string]: any;
};

type Visitor = (config: {
    path: string[];
    actionType: string;
    requestAction: Function;
    resetAction: Function;
    removeEntityAction: Function;
    generateResultKey: Function;
}) => any;

export default function EntityApiFactory(actionMap: ActionMap, visitor: Visitor) {
    return visitActionMap(actionMap, (sideEffect: () => Promise<any>, path: string[]) => {
        const actionType = path.join('_').toUpperCase();
        const requestAction = createRequestAction(sideEffect);

        return visitor({
            path,
            actionType,
            requestAction,
            resetAction,
            removeEntityAction,
            generateResultKey: (payload: any) => Hash({payload, actionType})
        });
    });
}

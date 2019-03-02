// @flow
import createRequestAction from './createRequestAction';

// @DEPRECATED
// This is only used by the mutation and query hocks
// RequestHoc has more powerful composition and so the actions dont need to be chained
export default function createAllRequestAction(fetchAction: string, receiveAction: string, errorAction: string, sideEffectList: Array<SideEffect>): Function {
    function sideEffect(requestPayload: *, meta: Object): Promise<*> {
        return Promise
            // call all sideeffects
            .all(sideEffectList.map(effect => effect(requestPayload, meta)))
            // merge them back to one object
            .then(payloads => payloads.reduce((out, payload) => Object.assign(out, payload), {}))
        ;
    }
    return createRequestAction(fetchAction, receiveAction, errorAction, sideEffect);
}

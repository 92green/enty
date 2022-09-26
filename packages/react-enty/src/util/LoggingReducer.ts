import {State, Action} from './definitions';
const css = 'color: #7E488B;';

const log = (first: string, ...rest: unknown[]) => console.log(`%c${first}`, css, ...rest);
const group = (name: string) => console.groupCollapsed(`%c${name}`, css);
const groupEnd = () => console.groupEnd();

export default function LoggingReducer(state: State, action: Action) {
    const {type, meta, payload} = action;

    const responseKey = meta?.responseKey;
    const requestState = state.requestState[responseKey];
    const requestStateType =
        requestState &&
        requestState
            .emptyMap(() => 'empty')
            .fetchingMap(() => 'fetching')
            .refetchingMap(() => 'refetching')
            .errorMap(() => 'error')
            .successMap(() => 'success')
            .value();

    if (type === 'ENTY_INIT') {
        log('Enty Debug');
    } else if (type === 'ENTY_RESET') {
        log(`reset response ${responseKey}`);
    } else {
        group(`${action.meta.name}<${requestStateType}> (key: ${responseKey})`);
    }

    if (type === 'ENTY_FETCH') {
        log('state:', state);
    } else if (type === 'ENTY_RECEIVE') {
        log('payload:', payload);
        log('response:', state.response[responseKey]);
        log('state:', state);
    } else if (type === 'ENTY_ERROR') {
        log('error:', state.error[responseKey]);
        log('state:', state);
    } else if (type === 'ENTY_REMOVE') {
        log('remove:', payload.join && payload.join('.'));
        log(`entities.${payload[0]}:`, state.entities[payload[0]]);
        log('state:', state);
    }
    groupEnd();
    return state;
}

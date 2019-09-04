// @flow

const css = 'color: #7E488B;';
const log = (first: string, ...rest: mixed[]) => console.log(`%c${first}`, css, ...rest);
const group = (name: string) => console.group(`%c[${name}]`, css);
const groupEnd = (name: string) => console.groupEnd(`%c[${name}]`, css);

export default function LoggingReducer(state, action) {
    const {type, meta, payload} = action
    group(type);
    log('Meta', meta);
    log('Payload', payload);
    log('Next State', state);
    groupEnd(type);
    return state;
}


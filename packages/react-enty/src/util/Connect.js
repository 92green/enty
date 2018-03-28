//@flow
import {connect} from 'react-redux';
import type {HockOptions} from './definitions';


const defaultOptions = {
    stateKey: 'entity'
};

/*
 * Connect
 * @function
 */
export default function Connect(connector?: Function, options?: HockOptions): Function {
    const {stateKey, storeKey} = Object.assign({}, defaultOptions, options);

    return connect(
        connector,
        null,
        null,
        {
            storeKey,
            areStatesEqual: (prev, next) => prev[stateKey] === next[stateKey]
        }
    );
}

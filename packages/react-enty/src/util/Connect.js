//@flow
import {connect} from 'react-redux';
import type {HockOptions} from './definitions';
import type {HockMeta} from './definitions';


const defaultOptions = {
    stateKey: 'entity'
};

/*
 * Connect
 * @function
 */
export default function Connect(connector?: Function, options?: HockOptions|HockMeta): Function {
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


export function ConnectFull(
    mapStateToProps: *,
    actionCreators: *,
    mergeProps: *,
    options: *
): Function {
    const {stateKey = 'entity'} = options;
    const {storeKey} = options;

    return connect(
        mapStateToProps,
        actionCreators,
        mergeProps,
        {
            storeKey,
            areStatesEqual: (prev, next) => prev[stateKey] === next[stateKey]
        }
    );
}

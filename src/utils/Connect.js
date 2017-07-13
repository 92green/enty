//@flow
import {connect} from 'react-redux';

/**
 * @module Misc
 */

/**
 * Connect
 * @function
 * @memberof module:Misc
 */

const defaultOptions = {
    stateKey: 'entity'
};

export default function Connect(connector: Function, options: Object = {}): Function {
    const {stateKey} = Object.assign({}, defaultOptions, options);

    return connect(connector, null, null, {
        areStatesEqual: (prev, next) => prev[stateKey] === next[stateKey]
    });
}

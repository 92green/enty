//@flow
import {connect} from 'react-redux';


const defaultOptions = {
    stateKey: 'entity'
};

/*
 * Connect
 * @function
 */
export default function Connect(connector?: Function, options: Object = {}): Function {
    const {stateKey} = Object.assign({}, defaultOptions, options);

    return connect(
        connector,
        null,
        null,
        {
            areStatesEqual: (prev, next) => prev[stateKey] === next[stateKey]
        }
    );
}

//@flow
import {connect} from 'react-redux';
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';

/**
 * @module Misc
 */

/**
 * connectWithQuery
 * @function
 * @memberof module:Misc
 */
export default function connectWithQuery(connector: Function, onPropChange: Function, paths: string[]): Function {
    return function hockedConnectWithQuery(ComposedComponent) {
        const withState = connect(connector, null, null, {
            areStatesEqual: (prev, next) => prev.entity === next.entity
        });
        const withPropChange = PropChangeHock(() => ({paths, onPropChange}));
        return withState(withPropChange(ComposedComponent));
    };
}

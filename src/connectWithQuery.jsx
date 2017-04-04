//@flow
import {connect} from 'react-redux';
import PropChangeHock from './PropChangeHock';

/**
 * @module Misc
 */

/**
 * connectWithQuery
 * @function
 * @memberof module:Misc
 */
export default function connectWithQuery(connector: Function, query: Function, propChangeList: string[]): Function {
    return function hockedConnectWithQuery(ComposedComponent) {
        const reduxConnect = connect(connector, null, null, {
            areStatesEqual: (prev, next) => prev.entity === next.entity
        });
        const propChangeListener = PropChangeHock(propChangeList, query);
        return reduxConnect(propChangeListener(ComposedComponent));
    };
}

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
export function connectWithQuery(connector: Function, query: Function, propChangeList: string[]): Function {
    return function hockedConnectWithQuery(ComposedComponent: React.element<any>): React.element<any> {
        const reduxConnect = connect(connector);
        const propChangeListener = PropChangeHock(propChangeList, query);
        return reduxConnect(propChangeListener(ComposedComponent));
    };
}

import React, { Component, PropTypes } from 'react';
import {fromJS} from 'immutable';

/**
 * ```js
 * PropChangeHock(propKeys: [String], sideEffect: function) => (component: Component) => Component
 * ```
 * The prop change hock takes a side effect and an array of prop keys paths.
 * The component then listens for component mount and receive props.
 * If any of the provided props change the side effect is triggered.
 * @exports PropChangeHock
 * @param  {Array}      propKeys            list of strings of prop keys
 * @param  {function}   outputFunction
 * @return {function}   componentCreator    function to pass react component
 */
export default (propKeys = [], outputFunction) => (ComposedComponent) => {
    return class AutoRequest extends Component {
        constructor(props, context) {
            super(props, context);
        }
        componentWillMount() {
            outputFunction(this.props);
        }
        componentWillReceiveProps(nextProps) {
            // make props immutable Maps
            var thisPropsImmutable = fromJS(this.props);
            var nextPropsImmutable = fromJS(nextProps);

            var booleanTest = propKeys
                .map(ii => {
                    var keyPath = ii.split('.');
                    return thisPropsImmutable.getIn(keyPath) !== nextPropsImmutable.getIn(keyPath);
                })
                .indexOf(true)

            if(booleanTest !== -1) {
                outputFunction(nextProps);
            }
        }
        render() {
            return <ComposedComponent
                {...this.props}
                outputFunction={outputFunction.bind(null, this.props)}
             />;
        }
    }
}

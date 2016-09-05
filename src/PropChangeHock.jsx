import React, { Component, PropTypes } from 'react';
import {fromJS} from 'immutable';

export default (propKeys, outputFunction) => (ComposedComponent) => {
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
            return <ComposedComponent {...this.props} />;
        }
    }
}

import React, { Component } from 'react';

export default (reducer) => (ComposedComponent) => {
    return class LocalStateHock extends Component {
        constructor(props) {
            super(props);
            this.state = reducer(undefined, {});
            this.dispatch = this.dispatch.bind(this);
        }
        dispatch(action) {
            this.setState(prevState => reducer(prevState, action));
        }
        render() {
            return <ComposedComponent {...this.props} {...this.state} localDispatch={this.dispatch} />;
        }
    }
}

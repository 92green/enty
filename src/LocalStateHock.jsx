import React, {Component} from 'react';

/**
 * `LocalStateHock(reducer: function(state, action)) => function(component: Component)`
Wraps a component with a tiny implementation of the redux concept. Takes a reducer and returns a function ready to call with a component. The hock gives the component `props.localDispatch`which triggers the reducer. the return state of the reducer is then destructured on to the components as props.
 * @param  {function}   reducer             a function that acts as a local reducer
 * @return {function}   componentCreator    function to pass react component
 * @function
 * @memberof module:Misc
 */
export default function LocalStateHock(reducer) {
    return (ComposedComponent) => {
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
        };
    };
}

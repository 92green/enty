import thunk from 'redux-thunk';
import {combineReducers, compose, createStore, applyMiddleware} from 'redux';

// create and export the store
export default function EntityStoreFactory(reducer) {
    // create middleware
    var middleware = applyMiddleware(thunk);

    // hook up redux devtool
    const composeEnhancers = (process.env.NODE_ENV !== 'production' &&
        typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
        compose;

    return createStore(combineReducers({entity: reducer}), {}, composeEnhancers(middleware));
};

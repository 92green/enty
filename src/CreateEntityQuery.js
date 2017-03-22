import connectWithQuery from './connectWithQuery';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import {fromJS} from 'immutable';
import React from 'react';

/**
 * @module Creators
 */

/**
 * EntityQueries are the main way to request and receive entity state. For most components you will
 * have a query that should be fired on componentWillMount (also if certain props change) and you
 * would like the result of that query to be given to the component once it resolves.
 * `createEntityQuery` wraps all this together in a factory that returns an
 * EntityQueryHock. This lets you create different EntityQueryHocks for different side effects.
 * _Note: A graphql based application often only needs one._
 *
 * Each EntityQueryHock will listen for a change in props and trigger the `queryCreator`
 * function with the current props. The result of this will be given to the side effect.
 * The resulting data will be normalized and a reference will be stored under a auto-generated resultKey.
 * This result of this is selected along with it's `RequestState` and given to the decorated component as props.
 *
 * @param {function} sideEffect
 * @returns {EntityQueryHockFactory}
 * @memberof module:Creators
 */
export default function createEntityQuery(actionCreator: Function): Function {
    return (queryCreator: Function, propUpdateKeys: string[], metaOverride: Object): Function => {

        // distinct memo must be unique to each useage of EntityQuery
        const distinctToJS = new DistinctMemo(ii => ii ? ii.toJS() : {});

        return (composedComponent: React.Element<any>) => {
            const withQuery = connectWithQuery(
                function connector(state: Object, props: Object): Object {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    return {
                        ...selectEntityByResult(state, resultKey),
                        requestState : distinctToJS.value(state.entity.getIn(['_requestState', resultKey]))
                    };
                },
                function query(props: Object) {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    const meta = Object.assign({}, {resultKey}, metaOverride);

                    return props.dispatch(actionCreator(queryCreator(props), meta));
                },
                propUpdateKeys
            );

            return withQuery(composedComponent);
        };

    };
}

//@flow
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';

import RequestStateSelector from './RequestStateSelector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import Connect from './utils/Connect';
import {fromJS} from 'immutable';
import React from 'react';

/**
 * @module Misc
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
 * @memberof module:Misc
 */
export default function EntityQueryHockFactory(actionCreator: Function, selectOptions: Object): Function {
    return function EntityQueryHock(queryCreator: Function, paths: string[], optionsOverride: Object): Function {

        const options = {
            requestStateProp: 'requestState',
            ...optionsOverride
        };

        // distinct memo must be unique to each useage of EntityQuery
        const distinctSuccessMap = new DistinctMemo((value, data) => value.successMap(() => data));

        return function EntityQueryHockApplier(Component: React.Element<any>): any {

            const withState = Connect((state: Object, props: Object): Object => {
                const resultKey = options.resultKey || fromJS({hash: queryCreator(props)}).hashCode();
                const data = selectEntityByResult(state, resultKey, selectOptions);

                return {
                    ...data,
                    [options.requestStateProp]: distinctSuccessMap.value(RequestStateSelector(state, resultKey, selectOptions), data)
                };
            }, selectOptions);

            const withPropChange = PropChangeHock(() => ({
                paths,
                onPropChange: (props: Object): any => {
                    const resultKey = options.resultKey || fromJS({hash: queryCreator(props)}).hashCode();
                    const meta = Object.assign({}, options, {resultKey});

                    return props.dispatch(actionCreator(queryCreator(props), meta));
                }
            }));

            return withState(withPropChange(Component));
        };

    };
}

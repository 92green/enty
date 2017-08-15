//@flow
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';

import RequestStateSelector from './RequestStateSelector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import Connect from './utils/Connect';
import {fromJS} from 'immutable';
import React from 'react';



/**
 *
 * @param {function} sideEffect
 * @returns {EntityQueryHock}
 * @memberof module:Factories
 */
export default function EntityQueryHockFactory(actionCreator: Function, selectOptions: SelectOptions): Function {
    /**
     * Hocks are the primary means of connecting data to your views.
     *
     * @module Hocks
     */

    /**
     * QueryHock is used to request data before a component renders.
     * When one of the `updateKeys` on props changes the hock will pass the current props through
     * `queryCreator` and on to its corresponding promise in EntityApi.
     * The result of this promise is sent to the entity reducer along with a hash of `queryCreator` as a `resultKey`.
     *
     * The data is normalized, stored in state and then returned to the component. At each stage of the [entity flow]
     * An appropriate `RequestState` is given to the component. This means the component can be sure that the query is
     * fetching/re-fetching, has thrown an error, or has arrived safely.
     *
     *
     * @name QueryHock
     * @kind function
     * @param {function} queryCreator - turns
     * @param {string[]} updateKeys - description
     * @param {Object} [optionsOverride] - description
     * @returns {function}
     * @memberof module:Hocks
     */
    return function EntityQueryHock(queryCreator: Function, paths: string[], optionsOverride: Object): Function {

        const options = {
            queryRequestStateProp: 'queryRequestState',
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

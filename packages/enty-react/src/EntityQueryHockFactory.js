//@flow
import PropChangeHock from 'stampy/lib/hock/PropChangeHock';

import RequestStateSelector from './RequestStateSelector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './util/DistinctMemo';
import Connect from './util/Connect';
import {fromJS} from 'immutable';
import type {Element} from 'react';
import type {HockOptions} from './util/definitions';
import type {HockOptionsInput} from './util/definitions';


/**
 *
 * @param {function} sideEffect
 * @returns {EntityQueryHock}
 * @memberof module:Factories
 */
export default function EntityQueryHockFactory(actionCreator: Function, hockOptions?: HockOptionsInput): Function {
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
    return function EntityQueryHock(queryCreator: Function = () => null, optionsOverride: HockOptionsInput|Array<string>): Function {
        function parseOptions(options: HockOptionsInput|Array<string>): Object {
            if(Array.isArray(options)) {
                return {propChangeKeys: optionsOverride};
            }
            return options;
        }


        // distinct memo must be unique to each useage of EntityQuery
        const distinctSuccessMap = new DistinctMemo((value, data) => value.successMap(() => data));



        return function EntityQueryHockApplier(Component: Element<any>): any {

            const originalOptions: HockOptions = {
                ...hockOptions,
                group: null,
                propUpdate: aa => aa,
                updateResultKey: (aa) => aa,
                propChangeKeys: [],
                ...parseOptions(optionsOverride)
            };

            let options = {
                ...originalOptions
            };


            function getHash(props: Object, options: HockOptions): string {
                return (options.resultKey || fromJS({hash: queryCreator(props), requestActionName: options.requestActionName}).hashCode()) + '';
            }


            // console.log('Applier', options.requestActionName, options.resultKey);

            const withState = Connect((state: Object, props: Object): Object => {
                const resultKey = options.updateResultKey(getHash(props, options), props);

                const data = selectEntityByResult(state, resultKey, options);
                const childProps = options.propUpdate({
                    ...data,
                    requestState: distinctSuccessMap.value(RequestStateSelector(state, resultKey, options), data)
                });

                return options.group
                    ? {[options.group]: childProps}
                    : childProps;

            }, options);

            const withPropChange = PropChangeHock(() => ({
                paths: options.propChangeKeys,
                onPropChange: (props: Object): any => {
                    options.resultKey = getHash(props, options);
                    return props.dispatch(actionCreator(queryCreator(props), {...options, resultKey: options.resultKey && options.updateResultKey(options.resultKey, props)}));
                }
            }));

            return withState(withPropChange(Component));
        };

    };
}

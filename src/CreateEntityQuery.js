import {connectWithQuery} from './QueryConnector';
import {selectEntityByResult} from './EntitySelector';
import DistinctMemo from './utils/DistinctMemo';
import {fromJS} from 'immutable';

/**
 * @module Creators
 */

/**
 * Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect
 * @param  {function} sideEffect
 * @return {function} action creator
 * @memberof module:Creators
 */
export default function createEntityQuery(actionCreator) {
    return (queryCreator, propUpdateKeys, metaOverride) => {

        // distinct memo muse be unique to each useage of EntityQuery
        const distinctToJS = new DistinctMemo(ii => ii ? ii.toJS() : {});

        return (composedComponent) => {
            const withQuery = connectWithQuery(
                function connector(state, props) {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    return {
                        ...selectEntityByResult(state, resultKey),
                        requestState : distinctToJS.value(state.entity.getIn(['_requestState', resultKey]))
                    };
                },
                function query(props) {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    const meta = Object.assign({}, {resultKey}, metaOverride);

                    return props.dispatch(actionCreator(queryCreator(props), meta));
                },
                propUpdateKeys
            );

            return withQuery(composedComponent);
        }

    }
}

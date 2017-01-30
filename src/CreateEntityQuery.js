import {connectWithQuery} from './QueryConnector';
import {selectEntityByResult} from './EntitySelector';
import {fromJS, Map} from 'immutable';

/**
 * Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect
 * @param  {function} sideEffect
 * @return {function} action creator
 */
export default function entityQuery(action) {
    return (queryCreator, propUpdateKeys, metaOverride) => {

        return (composedComponent) => {
            const withQuery = connectWithQuery(
                function connector(state, props) {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    return {
                        ...selectEntityByResult(state, resultKey),
                        requestState : state.entity.getIn(['_requestState', resultKey], Map()).toJS()
                    }
                },
                function query(props) {
                    const resultKey = metaOverride && metaOverride.resultKey
                        ? metaOverride.resultKey
                        : fromJS({hash: queryCreator(props)}).hashCode();

                    const meta = Object.assign({}, {resultKey}, metaOverride);

                    return props.dispatch(action(queryCreator(props), meta));
                },
                propUpdateKeys
            );

            return withQuery(composedComponent);
        }

    }
}

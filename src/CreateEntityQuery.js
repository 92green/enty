import {connectWithQuery} from './QueryConnector';
import {selectEntity} from './EntitySelector';

function hash(query) {
    if(typeof query !== 'object' && typeof query !== 'string') {
        throw new TypeError('Invalid query type');
    }

    query = JSON.stringify(query);
    var hash = 0
    var i;
    var chr;
    var len;
    if (query.length === 0) return hash;
    for (i = 0, len = query.length; i < len; i++) {
        chr   = query.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};



/**
 * Takes an action creator and gives it a `resultKey`. wraps it in PropChangeHock, entitySelect and requestStateSelect
 * @param  {function} sideEffect
 * @return {function} action creator
 */
export default function entityQuery(action) {
    return (queryCreator, propUpdateKeys) => {
        return (composedComponent) => connectWithQuery(
            (state, props) => {
                return {
                    ...selectEntity(state, hash(queryCreator(props)))
                }
            },
            props => props.dispatch(action(queryCreator(props), {resultKey: hash(queryCreator(props))})),
            propUpdateKeys
        )(composedComponent)

    }
}

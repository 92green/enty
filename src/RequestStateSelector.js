import {Map, List} from 'immutable';


export function selectRequestState(state, actions) {
    // use custom request state if not provided
    var requestState = state.requestState || Map(state);

    switch(typeof actions) {
        case 'string':
            return requestState
                // filter out provided single actions from requestState
                .filter((ii, key) => key.indexOf(actions) > -1)
                // reduce to just fetch,error,receive
                .reduce((rr, ii, kk) => {
                    return rr.set(List(kk.split('_')).last().toLowerCase(), ii);
                }, Map())
                .toObject();

        default:
            return requestState
                // filter out provided list of actions from requestState
                .filter((ii, key) => actions.filter(action => key.indexOf(action) > -1).length > 0)
                // reduce to camelCase version of action names
                .reduce((rr, ii, kk) => {
                    var keyPath = key
                        .split('_')
                        // TitleCase
                        .map(ss => ss.toLowerCase().replace(/^./, ii => ii.toUpperCase()))
                        .join('')
                        // lowerCase first makes camelCase
                        .replace(/^./, ii => ii.toLowerCase());

                    return rr.set(keyPath, value);
                }, Map())
                .toObject();
    }


}

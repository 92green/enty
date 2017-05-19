import test from 'ava';
import selectRequestState from '../RequestStateSelector';
import {fromJS} from 'immutable';
import {RequestState} from 'fronads';

test('RequestStateSelector', tt => {

    var state = {
        entity: fromJS({
            _requestState: {
                ACTION: 'awesome'
            }
        })
    };

    tt.is(selectRequestState(state, 'ACTION'), 'awesome');
    tt.truthy(selectRequestState(state, 'BERG') instanceof RequestState().constructor);

});

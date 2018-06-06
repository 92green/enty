import test from 'ava';
import selectRequestState from '../RequestStateSelector';
import {fromJS} from 'immutable';
import {EmptyState} from '../RequestState';

test('RequestStateSelector', tt => {

    var state = {
        entity: fromJS({
            _requestState: {
                ACTION: 'awesome'
            }
        })
    };

    tt.is(selectRequestState(state, 'ACTION'), 'awesome');
    tt.truthy(selectRequestState(state, 'BERG') instanceof EmptyState().constructor);

});

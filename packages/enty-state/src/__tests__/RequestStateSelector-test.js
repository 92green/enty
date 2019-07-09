import selectRequestState from '../RequestStateSelector';
import {fromJS} from 'immutable';
import {EmptyState} from '../data/RequestState';

test('RequestStateSelector', () => {

    var state = {
        entity: fromJS({
            _requestState: {
                ACTION: 'awesome'
            }
        })
    };

    expect(selectRequestState(state, 'ACTION')).toBe('awesome');
    expect(selectRequestState(state, 'BERG') instanceof EmptyState().constructor).toBeTruthy();

});

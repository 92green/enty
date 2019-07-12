// @flow
import selectRequestState from '../RequestStateSelector';
import {EmptyState} from '../data/RequestState';

test('RequestStateSelector', () => {

    var state = {
        entity: {
            _requestState: {
                ACTION: 'awesome'
            }
        }
    };

    expect(selectRequestState(state, 'ACTION')).toBe('awesome');
    expect(selectRequestState(state, 'BERG') instanceof EmptyState().constructor).toBeTruthy();

});

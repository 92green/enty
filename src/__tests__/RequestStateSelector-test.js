import test from 'ava';
import selectRequestState from '../RequestStateSelector';
import {fromJS} from 'immutable';

test('CreateEntityReducer', tt => {

    var state = {
        entity: fromJS({
            _requestState: {
                ACTION: {
                    rad: 'awesome'
                }
            }
        })
    };

    tt.is(
        selectRequestState(state, 'ACTION').rad,
        'awesome'
    );

    tt.deepEqual(
        selectRequestState(state, 'BERG'),
        {}
    )

});

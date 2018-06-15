// @flow
import test from 'ava';
import {fromJS} from 'immutable';
import ErrorSelector from '../ErrorSelector';

test('will select errors out of state', t => {

    var state = {
        entity: fromJS({
            _error: {
                foo: 'error'
            }
        })
    };

    t.is(ErrorSelector(state, 'foo'), 'error');
});

test('can override stateKey', t => {

    var state = {
        bar: fromJS({
            _error: {
                foo: 'error'
            }
        })
    };

    t.is(ErrorSelector(state, 'foo', {stateKey: 'bar'}), 'error');
});

// @flow
import { fromJS } from 'immutable';
import ErrorSelector from '../ErrorSelector';

test('will select errors out of state', () => {

    var state = {
        entity: fromJS({
            _error: {
                foo: 'error'
            }
        })
    };

    expect(ErrorSelector(state, 'foo')).toBe('error');
});

test('can override stateKey', () => {

    var state = {
        bar: fromJS({
            _error: {
                foo: 'error'
            }
        })
    };

    expect(ErrorSelector(state, 'foo', {stateKey: 'bar'})).toBe('error');
});

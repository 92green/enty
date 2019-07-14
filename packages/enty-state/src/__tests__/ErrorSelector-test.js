// @flow
import ErrorSelector from '../ErrorSelector';

test('will select errors out of state', () => {

    var state = {
        entity: {
            _error: {
                foo: 'error'
            }
        }
    };

    expect(ErrorSelector(state, 'foo')).toBe('error');
});

test('can override stateKey', () => {

    var state = {
        bar: {
            _error: {
                foo: 'error'
            }
        }
    };

    expect(ErrorSelector(state, 'foo', {stateKey: 'bar'})).toBe('error');
});

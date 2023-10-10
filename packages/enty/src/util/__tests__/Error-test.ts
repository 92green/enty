import {UndefinedIdError} from '../Error';

test('UndefinedIdError', () => {
    expect(() => {
        throw UndefinedIdError('foo', 'bar');
    }).toThrow(/foo.*bar/);
});

// @flow
import createAllRequestAction from '../createAllRequestAction';

jest.mock('../../EntitySelector');

test('createAllRequestAction will call all sideffects', () => {
    var aa = jest.fn();
    var bb = jest.fn();
    var dispatch = jest.fn();
    var getState = jest.fn();

    const actionCreator = createAllRequestAction('ALL', [aa, bb]);
    const thunk = actionCreator(null, {});

    return thunk(dispatch, getState)
        .then(() => {
            expect(aa).toHaveBeenCalled();
            expect(bb).toHaveBeenCalled();
        });
});

test('createAllRequestAction will merge resulting objects', () => {
    var aa = jest.fn(async () => ({aa: 'aa'}));
    var bb = jest.fn(async () => ({bb: 'bb'}));
    var dispatch = jest.fn();
    var getState = jest.fn();

    const actionCreator = createAllRequestAction('ALL', [aa, bb]);
    const thunk = actionCreator(null, {});

    return thunk(dispatch, getState)
        .then(() => {
            expect(dispatch).toHaveBeenLastCalledWith({
                meta: {},
                payload: {aa: 'aa', bb: 'bb'},
                type: 'ALL_RECEIVE'
            });
        });
});

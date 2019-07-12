// @flow
import DistinctMemo from '../DistinctMemo';

const OLD = {a: 2};

test('DistinctMemo will cache values', () => {
    const update = jest.fn();
    const memo = new DistinctMemo((ii) => {
        update();
        return ii;
    });

    var value = memo.value(OLD);
    value = memo.value(OLD);
    value = memo.value(OLD);

    expect(value).toBe(OLD);
    expect(update).toHaveBeenCalledTimes(1);
});

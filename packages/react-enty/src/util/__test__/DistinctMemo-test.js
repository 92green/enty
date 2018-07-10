import {spy} from 'sinon';
import DistinctMemo from '../DistinctMemo';

const OLD = {a: 2};

test('DistinctMemo will cache values', () => {
    const update = spy();
    const memo = new DistinctMemo((ii) => {
        update();
        return ii;
    });

    var value = memo.value(OLD);
    value = memo.value(OLD);
    value = memo.value(OLD);

    expect(value).toBe(OLD);
    expect(update.callCount).toBe(1);
    // memo.value(NEW);
});

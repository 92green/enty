import test from 'ava';
import {spy} from 'sinon';
import DistinctMemo from '../DistinctMemo';

const OLD = {a: 2};

test('DistinctMemo will cache values', tt => {
    const update = spy();
    const memo = new DistinctMemo((ii) => {
        update();
        return ii;
    });

    var value = memo.value(OLD);
    value = memo.value(OLD);
    value = memo.value(OLD);

    tt.is(value, OLD);
    tt.is(update.callCount, 1);
    // memo.value(NEW);
});

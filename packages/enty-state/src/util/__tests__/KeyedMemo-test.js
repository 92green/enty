import {spy} from 'sinon';
import KeyedMemo from '../KeyedMemo';


test('KeyedMemo will cache values per key', () => {
    const memo = new KeyedMemo();

    // first run should be the direct result
    expect(memo.value('foo', 0, () => 'foo1')).toBe('foo1');
    // if value doesnt change neither will the output
    expect(memo.value('foo', 0, () => 'foo2')).toBe('foo1');
    // if value changes so will the output
    expect(memo.value('foo', 1, () => 'foo2')).toBe('foo2');

    // same again with a different key
    expect(memo.value('bar', 0, () => 'bar1')).toBe('bar1');
    expect(memo.value('bar', 0, () => 'bar2')).toBe('bar1');
    expect(memo.value('bar', 1, () => 'bar2')).toBe('bar2');

});

import {spy} from 'sinon';
import KeyedMemo from '../KeyedMemo';


test('KeyedMemo will cache values per key', () => {
    const memo = new KeyedMemo();

    expect(memo.value('foo', 0, () => 'foo1')).toBe('foo1');
    expect(memo.value('foo', 0, () => 'foo2')).toBe('foo1');
    expect(memo.value('foo', 1, () => 'foo2')).toBe('foo2');

    expect(memo.value('bar', 0, () => 'bar1')).toBe('bar1');
    expect(memo.value('bar', 0, () => 'bar2')).toBe('bar1');
    expect(memo.value('bar', 1, () => 'bar2')).toBe('bar2');

});

//@flow
import test from 'ava';
import sinon from 'sinon';
import MultiQueryHockFactory from '../MultiQueryHockFactory';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);


test('MultiQueryHockFactory will return a QueryHock', (t: Object) => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});

    t.is(MultiQueryHockFactory([aa,bb]).name, 'EntityQueryHock');
});

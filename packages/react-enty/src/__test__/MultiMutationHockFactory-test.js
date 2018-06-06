//@flow
import test from 'ava';
import sinon from 'sinon';
import MultiMutationHockFactory from '../MultiMutationHockFactory';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);


test('MultiMutationHockFactory will return a MutationHock', (t: Object) => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});

    t.is(MultiMutationHockFactory([aa,bb]).name, 'EntityMutationHock');
});

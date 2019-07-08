//@flow
import sinon from 'sinon';
import MultiMutationHockFactory from '../MultiMutationHockFactory';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);

global.console.warn = jest.fn();

test('MultiMutationHockFactory will return a MutationHock', () => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});

    expect(MultiMutationHockFactory([aa,bb]).name).toBe('EntityMutationHock');
});

//@flow
import sinon from 'sinon';
import MultiQueryHockFactory from '../MultiQueryHockFactory';

const RESOLVE = (aa) => Promise.resolve(aa);
const REJECT = (aa) => Promise.reject(aa);

global.console.warn = jest.fn();

test('MultiQueryHockFactory will return a QueryHock', () => {
    var aa = async () => ({aa: 'aa'});
    var bb = async () => ({bb: 'bb'});

    expect(MultiQueryHockFactory([aa,bb]).name).toBe('EntityQueryHock');
});

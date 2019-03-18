import {spy} from 'sinon';
import Hash from '../Hash';

const OLD = {a: 2};

describe('Hash', () => {

    it('will hash objects consitently', () => {
        const aa = Hash({foo: 'bar'});
        const bb = Hash({foo: 'bar'});
        expect(aa).toBe(bb);
    });

    it('will return a string', () => {
        const aa = Hash({foo: 'bar'});
        expect(typeof aa).toBe('string');
    });

});

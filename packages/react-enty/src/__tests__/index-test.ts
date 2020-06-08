import * as EntyState from 'enty-state';
import * as Enty from 'enty';
import * as ReactEnty from '../index';

const tests = new Set([...Object.keys(Enty), ...Object.keys(ReactEnty), ...Object.keys(EntyState)]);

describe.each(Array.from(tests.values()))(`import {%s} from 'react-enty'`, (name) => {
    test(`${name} is defined`, () => {
        expect(typeof ReactEnty[name]).toBeDefined();
    });
});

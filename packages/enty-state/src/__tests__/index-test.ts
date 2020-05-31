import * as EntyState from '../index';

describe.each([
    ['hash', 'function'],
    ['Message', 'function'],
    ['EntityStore', 'function']
])(`import {%s} from 'enty-state'`, (name, expected) => {
    test(`${name} is ${expected}`, () => {
        expect(typeof EntyState[name]).toBe(expected);
    });
});

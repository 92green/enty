//@flow
import Keyed from '../Keyed';
import ObjectSchema from '../../ObjectSchema';

it('can set a definition through the constructor', () => {
    const foo = ObjectSchema();
    const keyed = new Keyed({foo});
    expect(keyed.definition.foo).toBe(foo);
});

it('can access the definition through get', () => {
    const foo = ObjectSchema();
    const keyed = new Keyed({foo});
    expect(keyed.get('foo')).toBe(foo);
});

it('can change the definition through set', () => {
    const foo = ObjectSchema();
    const bar = ObjectSchema();
    const keyed = new Keyed({foo});
    expect(keyed.get('foo')).toBe(foo);
    keyed.set('foo', bar);
    expect(keyed.get('foo')).toBe(bar);
});

describe('update', () => {
    test('if the first parameter is a function it will give updater the whole definition', () => {
        const foo = ObjectSchema();
        const bar = ObjectSchema();
        const keyed = new Keyed({foo});
        keyed.update((obj) => {
            expect(obj).toMatchObject({foo});
            return {bar};
        });
        expect(keyed.get('bar')).toBe(bar);
        expect(keyed.get('foo')).toBeUndefined();
    });
    test('if the second parameter is a function it will update only the key provided', () => {
        const foo = ObjectSchema();
        const bar = ObjectSchema();
        const keyed = new Keyed({foo});
        keyed.update('foo', (obj) => {
            expect(obj).toBe(foo);
            return bar;
        });
        expect(keyed.get('foo')).toBe(bar);
    });
    test('if no functions are provided it will throw', () => {
        const foo = ObjectSchema();
        const keyed = new Keyed({foo});
        // $FlowFixMe - inentional missue of types for testing
        expect(() => keyed.update('foo', 'wrong!')).toThrow(/function/);
        expect(() => keyed.update('foo')).toThrow(/function/);
    });
});

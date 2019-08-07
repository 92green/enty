//@flow
import NullSchema from '../NullSchema';

var foo = new NullSchema('foo');

it('will create a dummy schema that will throw all methods', () => {
    expect(() => foo.create()).toThrow(/create/);
    expect(() => foo.merge()).toThrow(/merge/);
    expect(() => foo.idAttribute()).toThrow(/idAttribute/);
    expect(() => foo.normalize()).toThrow(/normalize/);
    expect(() => foo.denormalize()).toThrow(/denormalize/);
});



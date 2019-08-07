//@flow
import ObjectSchema from '../ObjectSchema';
import ValueSchema from '../ValueSchema';

const foo = new ObjectSchema({
    name: new ValueSchema('name'),
    date: new ValueSchema('date', {idAttribute: x => x.getTime().toString()})
});


it('normalizes and denormalizes transparently', () => {
    const input = {name: 'john', date: new Date()};
    expect(foo.denormalize(foo.normalize(input))).toEqual(input);
});

it('can calculate its id through idAttribute', () => {
    const fakeDate = new Date(1);
    const input = {name: 'john', date: fakeDate};
    const state = foo.normalize(input);
    expect(state.entities.date).toEqual({["1"]: fakeDate});
    expect(state.entities.date).not.toEqual({[fakeDate.toString()]: fakeDate});
});

it('can normalize values', () => {
    const input = {name: 'john'};
    const state = foo.normalize(input);
    expect(state.entities.name.john).toBe('john');
});

it('can denormalize values', () => {
    let state = foo.normalize({name: 'john', date: new Date(1)});
    state.entities.name.john = 'FAKE';
    expect(foo.denormalize(state)).toEqual({name: 'FAKE', date: new Date(1)});
});


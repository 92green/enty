import * as Enty from '../index';

test('that index has a defined set of exports', () => {
    const exportCount = 7;
    expect.assertions(exportCount + 1);
    const exportList = Object.keys(Enty);
    expect(exportList).toHaveLength(exportCount);

    expect(Enty.EntitySchema).toBeDefined();
    expect(Enty.ArraySchema).toBeDefined();
    expect(Enty.ObjectSchema).toBeDefined();
    expect(Enty.CompositeEntitySchema).toBeDefined();
    expect(Enty.IdSchema).toBeDefined();
    expect(Enty.DynamicSchema).toBeDefined();
    expect(Enty.REMOVED_ENTITY).toBeDefined();
});


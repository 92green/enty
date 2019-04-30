//@flow
import * as ReactEnty from '../index';


test('that index has a defined set of exports', () => {
    const exportList = Object.keys(ReactEnty);

    expect.assertions(18); // number of exports + 1 for the exportList
    expect(exportList).toHaveLength(17);

    expect(ReactEnty.EntitySchema).toBeDefined();
    expect(ReactEnty.ArraySchema).toBeDefined();
    expect(ReactEnty.ObjectSchema).toBeDefined();
    expect(ReactEnty.CompositeEntitySchema).toBeDefined();
    expect(ReactEnty.NullSchema).toBeDefined();
    expect(ReactEnty.ValueSchema).toBeDefined();
    expect(ReactEnty.DynamicSchema).toBeDefined();


    expect(ReactEnty.EntityApi).toBeDefined();
    expect(ReactEnty.selectEntityByResult).toBeDefined();
    expect(ReactEnty.selectEntityById).toBeDefined();
    expect(ReactEnty.selectEntityByType).toBeDefined();
    expect(ReactEnty.selectRequestState).toBeDefined();

    expect(ReactEnty.EmptyState).toBeDefined();
    expect(ReactEnty.FetchingState).toBeDefined();
    expect(ReactEnty.RefetchingState).toBeDefined();
    expect(ReactEnty.ErrorState).toBeDefined();
    expect(ReactEnty.SuccessState).toBeDefined();
});


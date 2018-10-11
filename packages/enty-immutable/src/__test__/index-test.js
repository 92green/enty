
//@flow
import * as EntyImmutable from '../index';


test('that index has a defined set of exports', () => {
    expect.assertions(3); // number of exports + 1 for the exportList
    const exportList = Object.keys(EntyImmutable);
    expect(exportList).toHaveLength(2);

    expect(EntyImmutable.MapSchema).toBeDefined();
    expect(EntyImmutable.ListSchema).toBeDefined();
});



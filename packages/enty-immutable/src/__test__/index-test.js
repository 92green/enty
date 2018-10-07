
//@flow
import * as EntyImmutable from '../index';


test('that index has a defined set of exports', () => {
    const exportList = Object.keys(EntyImmutable);
    expect(exportList).toHaveLength(2);

    expect(Enty.MapSchema).toBeDefined();
    expect(Enty.ListSchema).toBeDefined();
});



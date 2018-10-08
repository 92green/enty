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


//export {default as ArraySchema} from 'enty/lib/ArraySchema';
//export {default as CompositeEntitySchema} from 'enty/lib/CompositeEntitySchema';
//export {default as DynamicSchema} from 'enty/lib/DynamicSchema';
//export {default as EntitySchema} from 'enty/lib/EntitySchema';
//export {default as ListSchema} from 'enty/lib/ListSchema';
//export {default as MapSchema} from 'enty/lib/MapSchema';
//export {default as ObjectSchema} from 'enty/lib/ObjectSchema';
//export {default as ValueSchema} from 'enty/lib/ValueSchema';

//// Api
//export {default as EntityApi} from './EntityApi';


//// Selectors
//export {selectEntityByResult} from './EntitySelector';
//export {selectEntityById} from './EntitySelector';
//export {selectEntityByType} from './EntitySelector';
//export {default as selectRequestState} from './RequestStateSelector';


//// Misc
//export {EmptyState} from './RequestState';
//export {FetchingState} from './RequestState';
//export {RefetchingState} from './RequestState';
//export {ErrorState} from './RequestState';
//export {SuccessState} from './RequestState';

//@flow
import * as ReactEnty from '../index';


test('that index has a defined set of exports', () => {
    const exportList = Object.keys(ReactEnty);
    expect(exportList).toHaveLength(18);

    expect(ReactEnty.EntitySchema).toBeDefined();
    expect(ReactEnty.ArraySchema).toBeDefined();
    expect(ReactEnty.ObjectSchema).toBeDefined();
    expect(ReactEnty.CompositeEntitySchema).toBeDefined();
    expect(ReactEnty.NullSchema).toBeDefined();
    expect(ReactEnty.ValueSchema).toBeDefined();
    expect(ReactEnty.DynamicSchema).toBeDefined();


    expect(ReactEnty.DynamicSchema).toBeDefined();
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

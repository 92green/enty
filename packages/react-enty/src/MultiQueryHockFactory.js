//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';

import EntityQueryHockFactory from './EntityQueryHockFactory';
import createAllRequestAction from './api/createAllRequestAction';
import Deprecated from './util/Deprecated';

/**
 * Lorem ipsum dolor sit amet, consectetur _adipisicing_ elit. Commodi at optio quos animi aut officia
 * in enim inventore quasi harum, deleniti praesentium, **sed** cumque dolor impedit necessitatibus. Nobis, blanditiis, quo!
 */
function MultiQueryHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';

    Deprecated('MultiQueryHockFactory has been deprecated in favor of much improved MultiRequestHock. Check the docs for usage instructions.');
    return EntityQueryHockFactory(createAllRequestAction(actionPrefix, sideEffectList), hockOptions);
}

export default MultiQueryHockFactory;

//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from 'enty-state/lib/util/definitions';

import EntityMutationHockFactory from './EntityMutationHockFactory';
import createAllRequestAction from 'enty-state/lib/api/createAllRequestAction';
import Deprecated from './util/Deprecated';

/**
 * MultiMutationHockFactory
 */
function MultiMutationHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';

    Deprecated('MultiMutationHockFactory has been deprecated in favor of much improved MultiRequestHock. Check the docs for usage instructions.');
    return EntityMutationHockFactory(createAllRequestAction(actionPrefix, sideEffectList), hockOptions);
}

export default MultiMutationHockFactory;

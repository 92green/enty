//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';

import EntityQueryHockFactory from './EntityQueryHockFactory';
import createAllRequestAction from 'enty-state/lib/api/createAllRequestAction';
import Deprecated from './util/Deprecated';

export default function MultiQueryHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';

    Deprecated('MultiQueryHockFactory has been deprecated in favor of much improved MultiRequestHock. Check the docs for usage instructions.');
    return EntityQueryHockFactory(createAllRequestAction(actionPrefix, sideEffectList), hockOptions);
}


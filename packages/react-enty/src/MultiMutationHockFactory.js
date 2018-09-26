//@flow
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';

import EntityMutationHockFactory from './EntityMutationHockFactory';
import {createAllRequestAction} from './EntityApi';
import Deprecated from './util/Deprecated';

/**
 * MultiMutationHockFactory
 */
function MultiMutationHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';
    const FETCH = `${actionPrefix}_FETCH`;
    const RECEIVE = `${actionPrefix}_RECEIVE`;
    const ERROR = `${actionPrefix}_ERROR`;

    Deprecated('MultiMutationHockFactory has been deprecated in favor of much improved MultiRequestHock. Check the docs for usage instructions.');
    return EntityMutationHockFactory(createAllRequestAction(FETCH, RECEIVE, ERROR, sideEffectList), hockOptions);
}

export default MultiMutationHockFactory;

//@flow
import EntityQueryHockFactory from './EntityQueryHockFactory';
import {createAllRequestAction} from './EntityApi';
import type {HockOptionsInput} from './definitions';
import type {SideEffect} from './definitions';


/**
 *
 * @param {function} sideEffect
 * @returns {EntityQueryHock}
 * @memberof module:Factories
 */
export default function MultiQueryHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';
    const FETCH = `${actionPrefix}_FETCH`;
    const RECEIVE = `${actionPrefix}_RECEIVE`;
    const ERROR = `${actionPrefix}_ERROR`;

    return EntityQueryHockFactory(createAllRequestAction(FETCH, RECEIVE, ERROR, sideEffectList), hockOptions);
}

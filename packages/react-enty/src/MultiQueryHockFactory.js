//@flow
import EntityQueryHockFactory from './EntityQueryHockFactory';
import {createAllRequestAction} from './EntityApi';
import type {HockOptionsInput} from './util/definitions';
import type {SideEffect} from './util/definitions';


/**
 * Lorem ipsum dolor sit amet, consectetur _adipisicing_ elit. Commodi at optio quos animi aut officia
 * in enim inventore quasi harum, deleniti praesentium, **sed** cumque dolor impedit necessitatibus. Nobis, blanditiis, quo!
 *
 * @param sideEffectList
 * Descrition of the side effect list
 *
 * @returns
 * It returns a function
 */
export default function MultiQueryHockFactory(sideEffectList: Array<SideEffect>, hockOptions?: HockOptionsInput): Function {
    const actionPrefix = 'ENTITY';
    const FETCH = `${actionPrefix}_FETCH`;
    const RECEIVE = `${actionPrefix}_RECEIVE`;
    const ERROR = `${actionPrefix}_ERROR`;

    return EntityQueryHockFactory(createAllRequestAction(FETCH, RECEIVE, ERROR, sideEffectList), hockOptions);
}

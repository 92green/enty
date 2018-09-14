//@flow
import {Iterable, Map} from 'immutable';
import ListSchema from 'enty/lib/ListSchema';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/lib/get';
import KeyedMemo from './util/KeyedMemo';

/**
 * @module Selectors
 */

/**
 * Given a requestKey it will return the denormalized state object.
 */

const DenormalizeCache = new KeyedMemo();

export function selectEntityByResult(state: Object, resultKey: string, options: Object = {}): * {
    const {schemaKey = 'ENTITY_RECEIVE'} = options;
    const {stateKey = 'entity'} = options;

    const entities = state[stateKey];
    const schema = getIn(['_baseSchema', schemaKey])(entities);
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(entities);


    if(!schema) {
        return;
    }

    const result = resultKey
        ? getIn(['_result', resultKey], schema.options.constructor())(entities)
        : schema.options.constructor()
    ;

    var data = DenormalizeCache.value(
        resultKey,
        normalizeCount,
        () => schema.denormalize({result, entities})
    );

    if(Iterable.isIndexed(data)) {
        return data.toArray ? data.toArray() : data;
    }
    return data.toObject ? data.toObject() : data;
}

/**
 * Given a type and id of and entity in state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 */
export function selectEntityById(state: Object, type: string, id: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const entities = state[stateKey];
    const schema = getIn(['_schemas', type])(entities);
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(entities);

    if(!schema) {
        return;
    }

    return DenormalizeCache.value(
        `${type}-${id}`,
        normalizeCount,
        () => schema.denormalize({result: id, entities})
    );
}

/**
 * Access a whole entity type as a list
 */
export function selectEntityByType(state: Object, type: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const entities = state[stateKey];
    const schema = ListSchema(getIn(['_schemas', type])(entities));
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(entities);


    return DenormalizeCache.value(
        type,
        normalizeCount,
        () => schema.denormalize({
            result: get(type, Map())(entities)
                .keySeq()
                .toList(),
            entities
        })
    );
}


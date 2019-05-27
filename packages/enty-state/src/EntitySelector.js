//@flow
import ArraySchema from 'enty/lib/ArraySchema';
import getIn from 'unmutable/lib/getIn';
import get from 'unmutable/lib/get';
import keyArray from 'unmutable/lib/keyArray';
import toArray from 'unmutable/lib/toArray';
import toObject from 'unmutable/lib/toObject';
import pipeWith from 'unmutable/lib/util/pipeWith';
import isIndexed from 'unmutable/lib/util/isIndexed';
import doIf from 'unmutable/lib/doIf';
import KeyedMemo from './util/KeyedMemo';

/**
 * @module Selectors
 */

/**
 * Given a requestKey it will return the denormalized state object.
 */

const DenormalizeCache = new KeyedMemo();

export function selectEntityByResult(state: Object, resultKey: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const store = state[stateKey];
    const entities = get('_entities')(store);
    const schema = get('_baseSchema')(store);
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(store);
    const cacheKey = `${resultKey}-${normalizeCount}`;

    if(!schema) {
        return;
    }

    const result = resultKey
        ? getIn(['_result', resultKey], schema.options.constructor())(store)
        : schema.options.constructor()
    ;


    const data = DenormalizeCache.value(
        cacheKey,
        cacheKey,
        () => schema.denormalize({result, entities})
    );

    return pipeWith(
        data,
        doIf(isIndexed, toArray(), toObject())
    );
}

/**
 * Given a type and id of and entity in state it will return the denormalized state.
 * This function is only used when you are certain you need the exact id in entity state.
 * Most often the request key is more appropriate.
 */
export function selectEntityById(state: Object, type: string, id: string, options: Object = {}): * {
    const {stateKey = 'entity'} = options;
    const store = state[stateKey];
    const entities = get('_entities')(store);
    const schema = getIn(['_schemas', type])(store);
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(store);

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
    const store = state[stateKey];
    const entities = get('_entities')(store);
    const schema = ArraySchema(getIn(['_schemas', type])(store));
    const normalizeCount = getIn(['_stats', 'normalizeCount'])(store);

    return DenormalizeCache.value(
        type,
        normalizeCount,
        () => schema.denormalize({
            result: pipeWith(
                entities,
                get(type, {}),
                keyArray()
            ),
            entities
        })
    );
}


import {fromJS, Iterable} from 'immutable';
import {denormalize} from 'denormalizr';
import {normalize} from 'normalizr';

const initialState = fromJS({
    result: {}
});

function defaultConstructor(key, value) {
    return value;
}

function determineReviverType(constructor, schemaKey) {
    return (key, value) => {
        // Check if the value is an array or object and convert to that for them.
        var isIndexed = Iterable.isIndexed(value);
        var returnValue = isIndexed ? value.toList() : value.toMap();

        // the key from the schema is used if key is undefined
        // this is only the case if we are at the top level of our payload
        // that way the reviver gets knowlege of what type of schema we are using
        return constructor(key || schemaKey, returnValue);
    }
}

export function createEntityReducer(schemas, constructor = defaultConstructor) {
    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta = {}}) {
        var schema = schemas[type] || {};

        if(schemas[type]) {
            // revive data from raw payload
            var reducedData = fromJS(payload, determineReviverType(constructor, schema._key)).toJS();
            // normlaize using proved schema
            var {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

            return state
                // set results
                .setIn(['result', meta.resultKey || type], result)
                // merge entities
                .mergeDeep(entities);

        }

        return state;
    }
}

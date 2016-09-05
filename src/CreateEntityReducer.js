import {fromJS, Map, Iterable} from 'immutable';
import {denormalize} from 'denormalizr';
import {normalize} from 'normalizr';



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

export function createEntityReducer(schemaMap, constructor = defaultConstructor) {

    const initialState = fromJS({
        _schema: schemaMap,
        _result: {},
    });

    // Return our constructed reducer
    return function EntityReducer(state = initialState, {type, payload, meta = {}}) {
        var schema = meta.schema || schemaMap[type];

        if(schema && payload) {
            // revive data from raw payload
            var reducedData = fromJS(payload, determineReviverType(constructor, schema._key)).toJS();
            // normalize using proved schema
            var {result, entities} = fromJS(normalize(reducedData, schema)).toObject();

            // var resultData = (schema._key) ? Map().set(schema._key, result) : result;
            var resultData = result;

            return state
                // set results
                .setIn(['_result', meta.resultKey || type], resultData)
                // merge entities
                .mergeDeep(entities);

        }

        return state;
    }
}

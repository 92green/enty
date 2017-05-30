import {ArraySchema, ObjectSchema} from './Schema';
import {Map, List} from 'immutable';

const DELETED = "@@DELETED@@";

const denormalizeEntity = (result, schema, entities, path) => {
    const denormalizedEntity = entities.getIn([schema.name, result]);
    const childKeys = schema.children ? Object.keys(schema.children) : [];
    const childData = childKeys.reduce((childResult, childKey) => {
        // 1. check path for our current key to avoid infinite recursion.
        // 2. dont denormalize null results
        if(path.contains(childKey) || !denormalizedEntity.get(childKey)) {
            return childResult;
        }
        return childResult.set(childKey, denormalize(denormalizedEntity.get(childKey), schema.children[childKey], entities, path.concat(childKey)));
    }, Map());

    return denormalizedEntity.merge(childData);
};

function denormalizeObject(result = Map(), schema, entities, path) {
    const {itemSchema, options} = schema;
    let deletedKeys = [];

    // Map denormalize to the values of result, but only
    // if they have a corresponding schema. Otherwise return the plain value.
    // Then filter out deleted keys, keeping track of ones deleted
    // Then Pump the filtered object through `denormalizeFilter`
    return result
        .map((item, key) => {
            if(itemSchema[key]) {
                return denormalize(item, itemSchema[key], entities, path.concat(key));
            }

            return item;
        })
        .filter((ii, key) => {
            if (ii === DELETED) {
                deletedKeys.push(key);
                return false;
            }
            return true;
        })
        .update(ii => options.denormalizeFilter(ii, deletedKeys) ? ii : DELETED);
}

const denormalizeArray = (result, schema, entities, path) => {
    const {itemSchema} = schema;
    // Map denormalize to our result List.
    // Filter out any deleted keys
    return result
        .map((item) => denormalize(item, itemSchema, entities, path))
        .filter(ii => ii !== DELETED);
};


export default function denormalize(result, schema, entities, path = List()) {
    const currentEntity = entities.getIn([schema.name, result]);

    // Dont try to denormalize null values
    if(result == null) {
        return result;
    }

    switch(schema.type) {
        case 'entity':
            if(!result) {
                return result;
            }
            if(!schema.options.denormalizeFilter(currentEntity)) {
                return DELETED;
            }
            return denormalizeEntity(result, schema, entities, path);

        case 'object':
            return denormalizeObject(result, schema, entities, path);

        case 'array':
            return denormalizeArray(result, schema, entities, path);

        default:
            if(Array.isArray(schema)) {
                return denormalizeArray(result, new ArraySchema(schema[0]), entities, path);
            } else {
                return denormalizeObject(result, new ObjectSchema(schema), entities, path);
            }
    }
}

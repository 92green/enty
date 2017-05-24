import {ArraySchema, ObjectSchema} from './Schema';
import {Map} from 'immutable';

const denormalizeEntity = (result, schema, entities) => {
    console.log('denormalizeArray', result, schema, entities);
    // const denormalizedEntity = entities[schema.name][result];
    const denormalizedEntity = entities.getIn([schema.name, result]);

    const childKeys = schema.children ? Object.keys(schema.children) : [];

    const childData = childKeys.reduce((childResult, childKey) => {
        // childResult[childKey] = denormalize(entities, denormalizedEntity[childKey], schema.children[childKey]);
        // return childResult;
        return childResult.set(childKey, denormalize(denormalizedEntity.get(childKey), schema.children[childKey], entities));
    }, Map());

    return denormalizedEntity.merge(childData);
    // Object.assign({}, denormalizedEntity, childData);
};

const denormalizeObject = (result, schema, entities) => {
    const {itemSchema, options} = schema;
    console.log('denormalizeObject', result, schema, entities);
    if(!result) {
        return Map()
    }
    return result
        .map((item, key) => {
            console.log(`denormalizeObject.${key}`, schema);
            if(itemSchema[key]) {
                return denormalize(item, itemSchema[key], entities);
            }

            return item;
        });
};

const denormalizeArray = (result, schema, entities) => {
    console.log('denormalizeArray', result);
    const itemSchema = schema.itemSchema;
    return result.map(id => denormalize(id, itemSchema, entities));
};


export default function denormalize(result, schema, entities) {
    // console.log('denormalize', result, schema);

    switch(schema.type) {
        case 'entity':
            return denormalizeEntity(result, schema, entities);

        case 'object':
            return denormalizeObject(result, schema, entities);

        case 'array':
            return denormalizeArray(result, schema, entities);

        default:
            if(Array.isArray(schema)) {
                return denormalizeArray(result, new ArraySchema(schema[0]), entities);
            } else {
                return denormalizeObject(result, new ObjectSchema(schema), entities);
            }
    }
}

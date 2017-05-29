import {ArraySchema, ObjectSchema} from './Schema';

const normalizeEntity = (data, schema, entities) => {
    // console.log('normalizeEntity', data, schema);
    entities[schema.name] = entities[schema.name] || {};

    const childKeys = schema.children ? Object.keys(schema.children) : [];
    const id = schema.options.idAttribute(data);

    const normalizedChildren = childKeys.map((key) => {
        if(data[key]) {
            return normalize(data[key], schema.children[key], entities);
        }
    });


    const childData = childKeys.reduce((result, key, index) => {
        if(normalizedChildren[index]) {
            result[key] = normalizedChildren[index].result;
        }
        return result;
    }, {});

    entities[schema.name][id] = Object.assign({}, data, childData);

    const result = id;

    return {entities, result};
};

const normalizeObject = (data, schema, entities) => {
    const {itemSchema} = schema;

    const result = Object.keys(data)
        .reduce((result, key) => {
            if(itemSchema[key] && data[key]) {
                result[key] = normalize(data[key], itemSchema[key], entities).result;
            }

            return result;
        }, data);

    return {entities, result};
};


const normalizeArray = (data, schema, entities) => {
    // console.log('normalizeArray', data, schema);
    const {itemSchema, options} = schema;
    const idAttribute = options.idAttribute;
    const result = data.map(item => {
        return (itemSchema.type === 'entity') ? idAttribute(item) : item;
    });

    data.forEach(item => normalize(item, itemSchema, entities));

    return {entities, result};
};


export default function normalize(data, schema, entities = {}) {
    switch(schema.type) {
        case 'entity':
            return normalizeEntity(data, schema, entities);

        case 'object':
            return normalizeObject(data, schema, entities);

        case 'array':
            return normalizeArray(data, schema, entities);

        default:
            if(Array.isArray(schema)) {
                return normalizeArray(data, new ArraySchema(schema[0]), entities);
            } else {
                return normalizeObject(data, new ObjectSchema(schema), entities);
            }
    }
}

// @flow

export class EntitySchema {
    constructor(name, children, options = {}) {
        this.name = name;
        this.type = 'entity';
        this.children = children;
        this.options = {
            idAttribute: item => item && item.id,
            denormalizeFilter: item => !item.get('deleted'),
            ...options
        };
    }
    define(children) {
        this.children = Object.assign({}, children);
    }
    normalize(data, schema, entities = {}) {
        // console.log('normalizeEntity', data);
        entities[schema.name] = entities[schema.name] || {};

        const childKeys = schema.children ? Object.keys(schema.children) : [];
        const id = schema.options.idAttribute(data);


        const normalizedChildren = childKeys.map((key) => {
            const itemSchema = schema.children[key];
            if(data[key]) {
                return itemSchema.normalize(data[key], itemSchema, entities);
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
    }
    denormalize(result, schema, entities, path = []) {
        const denormalizedEntity = entities.getIn([schema.name, result]);
        const childKeys = schema.children ? Object.keys(schema.children) : [];
        const childData = childKeys.reduce((childResult, childKey) => {
            const itemSchema = schema.children[childKey];
            // 1. check path for our current key to avoid infinite recursion.
            // 2. dont denormalize null results
            if(path.indexOf(childKey) !== -1 || !denormalizedEntity.get(childKey)) {
                return childResult;
            }
            return childResult.set(childKey, itemSchema.denormalize(denormalizedEntity.get(childKey), itemSchema, entities, path.concat(childKey)));
        }, Map());

        return denormalizedEntity.merge(childData);
    }
}

export default function EntitySchemaFactory(...args): EntitySchema {
    return new EntitySchema(...args);
}

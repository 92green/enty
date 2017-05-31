// @flow

import {DELETED_ENTITY} from './SchemaConstant';

export class ArraySchema {
    constructor(schema, options = {}) {
        this.type = 'array';
        this.itemSchema = schema;
        this.options = {
            idAttribute: item => item && item.id,
            ...options
        };
    }
    normalize(data, schema, entities = {}) {
        const {itemSchema, options} = schema;
        const idAttribute = options.idAttribute;
        const result = data.map(item => {
            return (itemSchema.type === 'entity')
                ? idAttribute(item)
                : itemSchema.normalize(item, itemSchema, entities).result;
        });

        data.forEach(item => itemSchema.normalize(item, itemSchema, entities));
        return {entities, result};
    }
    denormalize(result, schema, entities, path = []) {
        const {itemSchema} = schema;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item) => {
                return itemSchema.denormalize(item, itemSchema, entities, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}

export default function ArraySchemaFactory(...args): ArraySchema {
    return new ArraySchema(...args);
}

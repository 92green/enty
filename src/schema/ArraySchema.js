// @flow

import {DELETED_ENTITY} from './SchemaConstant';

export class ArraySchema {
    constructor(schema, options = {}) {
        this.type = 'array';
        this.itemSchema = schema;
        this.options = {
            ...options
        };
    }
    normalize(data, entities = {}) {
        const {itemSchema} = this;
        const idAttribute = itemSchema.options.idAttribute;
        const result = data.map(item => {
            return (itemSchema.type === 'entity')
                ? idAttribute(item)
                : itemSchema.normalize(item, entities).result;
        });

        data.forEach(item => itemSchema.normalize(item, entities));
        return {entities, result};
    }
    denormalize(result, entities, path = []) {
        const {itemSchema} = this;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item) => {
                return itemSchema.denormalize(item, entities, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}

export default function ArraySchemaFactory(...args): ArraySchema {
    return new ArraySchema(...args);
}

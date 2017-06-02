// @flow

import {DELETED_ENTITY} from './SchemaConstant';

export class OrphanSchema {
    constructor(name, schema, options = {}) {
        this.name = name;
        this.type = 'orphan';
        this.itemSchema = schema;
        this.options = {
            ...options
        };
    }
    normalize(data, schema, entities = {}) {
        entities[schema.type] = entities[schema.type] || {};
        entities[schema.type][schema.name] = schema.itemSchema.normalize(data, schema.itemSchema, entities).result;
        const result = schema.name;
        return {entities, result};
    }
    denormalize(result, schema, entities, path = []) {
        const {itemSchema} = schema;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }

        // console.log(result, entities.get(result), itemSchema.denormalize(entities.get(result), itemSchema, entities, path))
        // return entities.ge+t(result);
        return itemSchema.denormalize(entities.getIn([schema.type, result]), itemSchema, entities);
    }
}

export default function OrphanSchemaFactory(...args): OrphanSchema {
    return new OrphanSchema(...args);
}

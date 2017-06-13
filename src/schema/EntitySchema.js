// @flow
// import {Map} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';
import ObjectSchema from './ObjectSchema';

export class EntitySchema {
    name: string;
    type: string;
    options: Object;
    constructor(name: string, options: Object = {}) {
        this.name = name;
        this.type = 'entity';
        this.options = {
            idAttribute: item => item && item.id,
            denormalizeFilter: item => !item.get('deleted'),
            childSchema: ObjectSchema({}),
            ...options
        };
    }
    define(childSchema: any) {
        this.options.childSchema = childSchema;
        return this;
    }
    normalize(data: Object, schema: Object, entities: Object = {}) {
        const {options, name} = schema;
        const {idAttribute, childSchema} = options;
        const id = idAttribute(data);

        entities[name] = entities[name] || {};
        entities[name][id] = childSchema.normalize(data, childSchema, entities).result;
        const result = id;
        return {entities, result};
    }
    denormalize(result: Object, schema: Object, entities: Object, path: string[] = []) {
        const {name, options} = schema;
        const {childSchema, denormalizeFilter} = options;
        const entity = entities.getIn([name, result]);

        if(entity == null) {
            return entity;
        }

        if(!denormalizeFilter(entity)) {
            return DELETED_ENTITY;
        }

        return childSchema.denormalize(entity, childSchema, entities, path);
    }
}

export default function EntitySchemaFactory(...args: Array<any>): EntitySchema {
    return new EntitySchema(...args);
}

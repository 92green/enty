// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';

export class ObjectSchema {
    constructor(schema, options = {}) {
        this.type = 'object';
        this.itemSchema = schema;
        this.options = {
            denormalizeFilter: () => true,
            ...options
        };
    }
    normalize(data, entities = {}) {
        const {itemSchema} = this;

        const result = Object.keys(data)
            .reduce((result, key) => {
                if(itemSchema[key] && data[key]) {
                    result[key] = itemSchema[key].normalize(data[key], entities).result;
                }

                return result;
            }, Object.assign({}, data));

        return {entities, result};
    }
    denormalize(result, entities, path = []) {
        const {itemSchema, options} = this;
        let deletedKeys = [];

        if(result == null) {
            return result;
        }

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        return result
            .map((item, key) => {

                if(path.indexOf(key) !== -1) {
                    return item;
                }

                if(itemSchema[key]) {
                    return itemSchema[key].denormalize(item, entities, path.concat(key));
                }

                return item;
            })
            .filter((ii, key) => {
                if (ii === DELETED_ENTITY) {
                    deletedKeys.push(key);
                    return false;
                }
                return true;
            })
            .update(ii => options.denormalizeFilter(ii, deletedKeys) ? ii : DELETED_ENTITY);
    }
    merge(objectSchema: Object) {
        return new ObjectSchema(
            Object.assign({}, this.itemSchema, objectSchema.itemSchema),
            Object.assign({}, this.options, objectSchema.options)
        );
    }
}

export default function ObjectSchemaFactory(...args): ObjectSchema {
    return new ObjectSchema(...args);
}

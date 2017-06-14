// @flow
import {DELETED_ENTITY} from './SchemaConstant';

export class ObjectSchema {
    type: string;
    childSchema: Object;
    options: Object;
    constructor(schema: Object, options: Object = {}) {
        this.type = 'object';
        this.childSchema = schema;
        this.options = {
            denormalizeFilter: () => true,
            ...options
        };
    }
    normalize(data: Object, entities: Object = {}) {
        const {childSchema} = this;

        const result = Object.keys(data)
            .reduce((result, key) => {
                if(childSchema[key] && data[key]) {
                    result[key] = childSchema[key].normalize(data[key], entities).result;
                }

                return result;
            }, Object.assign({}, data));

        return {entities, result};
    }
    denormalize(result: Object, entities: Object, path: string[] = []) {
        const {childSchema, options} = this;
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

                if(childSchema[key]) {
                    return childSchema[key].denormalize(item, entities, path.concat(key));
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
    merge(objectSchema: Object): ObjectSchema {
        return new ObjectSchema(
            Object.assign({}, this.childSchema, objectSchema.childSchema),
            Object.assign({}, this.options, objectSchema.options)
        );
    }
}

export default function ObjectSchemaFactory(...args: any[]): ObjectSchema {
    return new ObjectSchema(...args);
}

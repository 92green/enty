// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';

export class ObjectSchema {
    type: string;
    childSchema: Object;
    options: Object;
    constructor(childSchema: Object, options: Object = {}) {
        this.type = 'object';
        this.childSchema = childSchema;
        this.options = {
            denormalizeFilter: () => true,
            ...options
        };
    }
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {childSchema} = this;
        const dataMap = Map(data);

        const result = dataMap
            .keySeq()
            .reduce((result: Object, key: string): any => {
                if(childSchema[key] && dataMap.get(key)) {
                    return result.set(key, childSchema[key].normalize(dataMap.get(key), entities).result);
                }

                return result;
            }, dataMap);

        return {entities, result};
    }
    denormalize(normalizeState: NormalizeState, path: string[] = []): any {
        const {result, entities} = normalizeState;
        const {childSchema, options} = this;
        let deletedKeys = [];

        if(result == null) {
            return result;
        }

        // Map denormalize to the values of result, but only
        // if they have a corresponding schema. Otherwise return the plain value.
        // Then filter out deleted keys, keeping track of ones deleted
        // Then Pump the filtered object through `denormalizeFilter`
        //
        // Lots of `item.keySeq().reduce(() => {}, item) because Immutable can't map records without
        // mutating them...
        return result
            .update((item: Map): Map => {
                return item.keySeq()
                    .reduce((newItem: any, key: string): Map => {
                        var value = newItem.get(key);
                        var newValue;

                        if(path.indexOf(key) !== -1) {
                            newValue = value;
                        } else if(childSchema[key]) {
                            newValue = childSchema[key].denormalize({result: value, entities}, path.concat(key));
                        } else {
                            newValue = value;
                        }

                        return newItem.set(key, newValue);
                    }, item);
            })
            .update((item: any): any => {
                return item.keySeq()
                    .filter(key => item.get(key) === DELETED_ENTITY)
                    .reduce((newItem: Map, deleteKey: string): Map => {
                        deletedKeys.push(deleteKey);
                        return newItem.delete(deleteKey);
                    }, item);
            })
            .update((ii: Map): Map => {
                return options.denormalizeFilter(ii, deletedKeys) ? ii : DELETED_ENTITY;
            });
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

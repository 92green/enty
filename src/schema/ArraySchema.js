// @flow
import {List} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';

export class ArraySchema {
    type: string;
    childSchema: Object;
    options: Object;
    constructor(schema: Object, options: Object = {}) {
        this.type = 'array';
        this.childSchema = schema;
        this.options = {
            ...options
        };
    }
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {childSchema} = this;
        const idAttribute = childSchema.options.idAttribute;
        const result = List(data)
            .map(item => {
                const {result} = childSchema.normalize(item, entities);
                return (childSchema.type === 'entity')
                    ? idAttribute(item).toString()
                    : result;
            });

        return {entities, result};
    }
    denormalize(normalizeState: NormalizeState, path: string[] = []) {
        const {result, entities} = normalizeState;
        const {childSchema} = this;
        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item) => {
                return childSchema.denormalize({result: item, entities}, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}

export default function ArraySchemaFactory(...args: any[]): ArraySchema {
    return new ArraySchema(...args);
}

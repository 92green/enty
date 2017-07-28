// @flow
import {Map} from 'immutable';
import {DELETED_ENTITY} from './SchemaConstant';
import ObjectSchema from './ObjectSchema';
import {getIn, get} from 'stampy/lib/util/CollectionUtils';

export class EntitySchema {
    name: string;
    type: string;
    options: Object;
    constructor(name: string, options: Object = {}) {
        this.name = name;
        this.type = 'entity';
        this.options = {
            idAttribute: item => item && get(item, 'id'),
            denormalizeFilter: item => item && !item.get('deleted'),
            constructor: item => Map(item),
            merge: (aa, bb) => aa.merge(bb),
            childSchema: ObjectSchema({}),
            ...options
        };
    }
    define(childSchema: any) {
        this.options.childSchema = childSchema;
        return this;
    }
    normalize(data: Object, entities: Object = {}) {
        const {options, name} = this;
        const {idAttribute, childSchema, constructor, merge} = options;
        const id = idAttribute(data).toString();

        entities[name] = entities[name] || {};

        const previousEntity = entities[name][id];
        let value = childSchema.normalize(data, entities).result;

        if(previousEntity) {
            value = merge(previousEntity, value);
        }

        entities[name][id] = constructor(value);

        return {
            entities, result: id
        };
    }
    denormalize(normalizeState: NormalizeState, path: string[] = []) {
        const {result, entities} = normalizeState;
        const {name, options} = this;
        const {childSchema, denormalizeFilter} = options;
        const entity = getIn(entities, [name, result]);

        if(entity == null) {
            return entity;
        }

        if(!denormalizeFilter(entity)) {
            return DELETED_ENTITY;
        }

        return childSchema.denormalize({result: entity, entities}, path);
    }
}

export default function EntitySchemaFactory(...args: any[]): EntitySchema {
    return new EntitySchema(...args);
}

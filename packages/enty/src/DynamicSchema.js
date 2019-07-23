// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {DynamicShape} from './util/definitions';



export default class DynamicSchema {
    shape: DynamicShape;
    constructor(shape: DynamicShape) {
        this.shape = shape;
    }

    normalize(data: Object, entities: Object = {}): NormalizeState {
        const schema = this.shape(data);
        const result = schema.normalize(data, entities);

        return {
            entities,
            schemas: result.schemas,
            result: {
                resultType: 'dynamicSchemaResult',
                result,
                schema
            }
        };
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {schema, result} = denormalizeState.result;
        return schema.denormalize(result, path);
    }
}


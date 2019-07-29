// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {Create} from './util/definitions';
import type {StructuralSchemaInterface} from './util/definitions';
import type {EntitySchemaInterface} from './util/definitions';
import type {Merge} from './util/definitions';
import type {StructuralSchemaOptions} from './util/definitions';
import type {SchemaInterface} from './util/definitions';

import {DELETED_ENTITY} from './util/SchemaConstant';

/**
 * Class for array schema.
 * Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate nobis quas exercitationem, eum, asperiores ut, perferendis harum beatae laborum magni assumenda enim qui incidunt ratione quia fugit praesentium dignissimos placeat.wrap
 *
 */
export default class ArraySchema implements StructuralSchemaInterface {
    shape: SchemaInterface;
    create: Create;
    merge: Merge;

    constructor(
        shape: StructuralSchemaInterface| EntitySchemaInterface,
        options: StructuralSchemaOptions = {}
    ) {
        this.shape = shape;
        this.merge = options.merge || ((aa, bb) => bb);
        this.create = options.create || (aa => aa);
    }

    normalize(data: mixed, entities: Object = {}): NormalizeState {
        let schemas = {};
        const result = this.create(data)
            .map((item: any): any => {
                const {result, schemas: childSchemas} = this.shape.normalize(item, entities);

                // add child schemas to the schema collection
                Object.assign(schemas, childSchemas);

                return result;
            });

        return {entities, schemas, result};
    }

    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {result, entities} = denormalizeState;

        // Filter out any deleted keys
        if(result == null) {
            return result;
        }
        // Map denormalize to our result List.
        return result
            .map((item: any): any => {
                return this.shape.denormalize({result: item, entities}, path);
            })
            .filter(ii => ii !== DELETED_ENTITY);
    }
}


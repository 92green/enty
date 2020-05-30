import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {ShapeSchema} from './util/definitions';
import {Entities} from './util/definitions';

import {CompositeKeysMustBeEntitiesError} from './util/Error';
import EntitySchema from './EntitySchema';

function isEntitySchema(schema: unknown): boolean {
    return schema instanceof EntitySchema || schema instanceof CompositeEntitySchema;
}

export default class CompositeEntitySchema<
    A extends ShapeSchema<any>,
    B extends Object
> extends EntitySchema<A> {
    compositeKeys: B;

    constructor(options: EntitySchemaOptions<A> & {compositeKeys?: B}) {
        super(options);
        this.compositeKeys = options.compositeKeys;
    }

    normalize(data: unknown, entities: Entities = {}): NormalizeState {
        const {compositeKeys, name} = this;
        const adjustedData = Object.assign({}, data);

        let idList = [];

        let compositeResults = {};
        Object.keys(compositeKeys).forEach((key: string) => {
            if (!isEntitySchema(compositeKeys[key])) {
                throw CompositeKeysMustBeEntitiesError(
                    `${name}.${key}`,
                    compositeKeys[key].constructor.name
                );
            }
            if (adjustedData[key] == null) {
                return null;
            }

            // normalize the tainted key
            const {result} = compositeKeys[key].normalize(adjustedData[key], entities);

            // remove tainted taineted key from main entity
            delete adjustedData[key];

            // store its id
            idList.push(result);

            compositeResults[key] = result;
        });

        // recurse into the main shape
        let {schemas, result: mainResult} = super.normalize(adjustedData, entities);

        const result = {
            [name]: mainResult,
            ...compositeResults,
        };

        const id = [mainResult].concat(idList).join('-');

        // dont need a safe check here as it is already done by composite normalizing
        entities[name][id] = result;

        schemas[name] = this;

        return {
            entities,
            schemas,
            result: id,
        };
    }

    /**
     * CompositeEntitySchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {shape, compositeKeys, name} = this;
        const {entities} = denormalizeState;

        // turn the composite id into its main and extra keys
        const result = super.denormalize(denormalizeState, path);

        const mainDenormalizedState = super.denormalize({result: result[name], entities}, path);

        let compositeDenormalizedState = {};
        Object.keys(compositeKeys).forEach((key: string) => {
            compositeDenormalizedState[key] = compositeKeys[key].denormalize(
                {result: result[key], entities},
                path
            );
        });

        return shape.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}

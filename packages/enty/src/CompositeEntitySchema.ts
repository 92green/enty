import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';

import map from 'unmutable/lib/map';
import {CompositeKeysMustBeEntitiesError} from './util/Error';
import EntitySchema from './EntitySchema';

function isEntitySchema(schema) {
    return schema instanceof EntitySchema || schema instanceof CompositeEntitySchema;
}

export default class CompositeEntitySchema<
    A extends StructuralSchemaInterface<any>,
    B extends {}
> extends EntitySchema<A> {
    compositeKeys: B;

    constructor(name: string, options: EntitySchemaOptions<A> & {compositeKeys: B} = {}) {
        super(name, options);
        this.compositeKeys = options.compositeKeys;
    }

    normalize(data: unknown, entities?: Object = {}): NormalizeState {
        const {compositeKeys, name} = this;
        const adjustedData = Object.assign({}, data);

        let idList = [];

        const compositeResults = map((schema, key) => {
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
            const {result: compositeResult} = compositeKeys[key].normalize(
                adjustedData[key],
                entities
            );

            // remove tainted taineted key from main entity
            delete adjustedData[key];

            // store its id
            idList.push(compositeResult);

            return compositeResult;
        })(compositeKeys);

        // recurse into the main shape
        let {schemas, result: mainResult} = super.normalize(adjustedData, entities);

        const result = {
            [name]: mainResult,
            ...compositeResults
        };

        const id = [mainResult].concat(idList).join('-');

        // dont need a safe check here as it is already done by composite normalizing
        entities[name][id] = result;

        // Save the schema
        schemas[name] = this;

        return {
            entities,
            schemas,
            result: id
        };
    }

    /**
     * CompositeEntitySchema.denormalize
     */
    denormalize(denormalizeState: DenormalizeState, path?: Array<any> = []): any {
        const {shape, compositeKeys, name} = this;
        const {entities} = denormalizeState;

        // turn the composite id into its main and extra keys
        const result = super.denormalize(denormalizeState, path);

        const mainDenormalizedState = super.denormalize({result: result[name], entities}, path);

        const compositeDenormalizedState = map((schema, key) =>
            schema.denormalize({result: result[key], entities}, path)
        )(compositeKeys);

        return shape.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}

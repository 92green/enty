import {NormalizeState} from './util/definitions';
import {DenormalizeState} from './util/definitions';
import {EntitySchemaOptions} from './util/definitions';
import {StructuralSchemaInterface} from './util/definitions';
import {Entities} from './util/definitions';
import {Schema} from './util/definitions';

import {CompositeKeysMustBeEntitiesError} from './util/Error';
import EntitySchema from './EntitySchema';

function isEntitySchema(schema: Schema): schema is EntitySchema<any> {
    return schema instanceof EntitySchema || schema instanceof CompositeEntitySchema;
}

export default class CompositeEntitySchema<
    A extends StructuralSchemaInterface<any>,
    B extends Record<string, any>
> extends EntitySchema<A> {
    compositeKeys: B;
    shape: A;

    constructor(name: string, options: EntitySchemaOptions<A> & {shape: A; compositeKeys: B}) {
        super(name, options);
        this.shape = options.shape;
        this.compositeKeys = options.compositeKeys;
    }

    normalize(data: unknown, entities: Entities = {}): NormalizeState {
        const {compositeKeys, name} = this;
        // @ts-ignore for now TODO This
        const adjustedData = {...data};

        let idList: string[] = [];

        const compositeResults = Object.keys(compositeKeys).reduce<Record<string, any>>(
            (rr, key) => {
                if (!isEntitySchema(compositeKeys[key])) {
                    throw CompositeKeysMustBeEntitiesError(
                        `${name}.${key}`,
                        compositeKeys[key].constructor.name
                    );
                }
                if (adjustedData[key] == null) {
                    return rr;
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

                rr[key] = compositeResult;
                return rr;
            },
            {}
        );

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
    denormalize(denormalizeState: DenormalizeState, path: Array<any> = []): any {
        const {shape, compositeKeys, name} = this;
        const {entities} = denormalizeState;

        // turn the composite id into its main and extra keys
        const result = super.denormalize(denormalizeState, path);

        const mainDenormalizedState = super.denormalize({result: result[name], entities}, path);

        const compositeDenormalizedState = Object.keys(compositeKeys).reduce((rr, key) => {
            if (result[key]) {
                // @ts-ignore for now
                rr[key] = compositeKeys[key].denormalize({result: result[key], entities}, path);
            }
            return rr;
        }, {});

        return shape.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}

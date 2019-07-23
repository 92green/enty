// @flow
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';
import type {EntitySchemaOptions} from './util/definitions';
import type {EntitySchemaInterface} from './util/definitions';
import type {StructuralSchemaInterface} from './util/definitions';
import type {IdAttribute} from './util/definitions';
import type {KeyedShape} from './util/definitions';

import getIn from 'unmutable/lib/getIn';
import {CompositeShapeMustBeEntityError} from './util/Error';
import {CompositeKeysMustBeEntitiesError} from './util/Error';
import {NoShapeError} from './util/Error';
import EntitySchema from './EntitySchema';

function isEntitySchema(schema) {
    return schema instanceof EntitySchema || schema instanceof CompositeEntitySchema;
}


export default class CompositeEntitySchema implements EntitySchemaInterface {
    name: string;
    compositeKeys: Object;
    shape: ?StructuralSchemaInterface;
    idAttribute: IdAttribute;

    constructor(
        name: string,
        options: EntitySchemaOptions & {compositeKeys: KeyedShape} = {}
    ) {
        this.name = name;
        this.shape = options.shape;
        this.compositeKeys = options.compositeKeys;
        this.idAttribute = options.idAttribute || (() => {});
    }

    normalize(data: Object, entities?: Object = {}): NormalizeState {
        const {shape, compositeKeys, name} = this;
        const adjustedData = Object.assign({}, data);

        let idList = [];

        if(!shape) {
            throw NoShapeError(name);
        }

        if(!isEntitySchema(shape)) {
            throw CompositeShapeMustBeEntityError(name, shape.constructor.name);
        }

        const compositeResults = Object.keys(this.compositeKeys)
            .reduce((rr: Object, key: string): Object => {
                if(!isEntitySchema(compositeKeys[key])) {
                    throw CompositeKeysMustBeEntitiesError(`${name}.${key}`, compositeKeys[key].constructor.name);
                }

                // Check that there is data before be continue
                // normalizing compositeKeys
                if(!adjustedData[key]) {
                    rr[key] = null;
                    return rr;
                }

                const {result: compositeResult} = compositeKeys[key].normalize(adjustedData[key], entities);

                rr[key] = compositeResult;
                idList.push(compositeResult);
                delete adjustedData[key];
                return rr;
            }, Object.assign({}, this.compositeKeys));



        // recurse into the main shape
        let {schemas, result: mainResult} = shape.normalize(adjustedData, entities);

        // $FlowFixMe - Error is so obtuse its not googlable: string [1] is not an object.
        const result = {
            [shape.name]: mainResult,
            ...compositeResults
        };

        const id = [mainResult]
            .concat(idList)
            .join('-')
        ;

        entities[name] = entities[name] || {};
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
    denormalize(denormalizeState: DenormalizeState, path?: Array<*> = []): any {
        const {shape, compositeKeys, name} = this;
        const {result, entities} = denormalizeState;

        const entity = getIn([name, result])(entities);

        const mainDenormalizedState = shape.denormalize({result: entity[shape.name], entities}, path);



        const compositeDenormalizedState = Object.keys(compositeKeys)
            .reduce((rr: Object, key: string): Object => {
                // Check that there is data before be continue
                // denormalize compositeKeys
                if(!entity[key]) {
                    rr[key] = null;
                    return rr;
                }
                rr[key] = compositeKeys[key].denormalize({result: entity[key], entities}, path);
                return rr;
            }, Object.assign({}, this.compositeKeys));

        return shape.shape.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}


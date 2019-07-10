// @flow
import type {Schema} from './util/definitions';
import type {Entity} from './util/definitions';
import type {NormalizeState} from './util/definitions';
import type {DenormalizeState} from './util/definitions';

import getIn from 'unmutable/lib/getIn';
import {CompositeDefinitionMustBeEntityError} from './util/Error';
import {CompositeKeysMustBeEntitiesError} from './util/Error';
import {NoDefinitionError} from './util/Error';
import Child from './abstract/Child';
import NullSchema from './NullSchema';


/**
 * CompositeEntitySchemaOptions
 */
type CompositeInput = {
    definition: Object,
    compositeKeys: *
};

/**
 * CompositeEntitySchema
 */
export class CompositeEntitySchema extends Child implements Schema<Entity> {
    type: string;
    options: Entity;
    compositeKeys: Object;
    definition: Schema<Entity>;

    constructor(
        name: string,
        {
            definition = new NullSchema(),
            compositeKeys = {},
            ...options
        }: CompositeInput = {}
    ) {
        super(definition);
        this.type = 'entity';
        this.compositeKeys = compositeKeys;

        this.options = {
            name,
            idAttribute: () => {},
            ...options
        };
    }

    /**
     * CompositeEntitySchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {definition, compositeKeys} = this;
        const {name} = this.options;

        const adjustedData = Object.assign({}, data);

        let idList = [];

        if(!definition) {
            throw NoDefinitionError(name);
        }

        if(definition.type !== 'entity') {
            throw CompositeDefinitionMustBeEntityError(name, definition.constructor.name);
        }

        const compositeResults = Object.keys(this.compositeKeys)
            .reduce((rr: Object, key: string): Object => {
                if(compositeKeys[key].type !== 'entity') {
                    throw CompositeKeysMustBeEntitiesError(`${name}.${key}`, compositeKeys[key].type);
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



        // recurse into the main definition
        let {schemas, result: mainResult} = definition.normalize(adjustedData, entities);

        // $FlowFixMe - Error is so obtuse its not googlable: string [1] is not an object.
        const result = {
            [definition.options.name]: mainResult,
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
    denormalize(denormalizeState: DenormalizeState, path: Array<*> = []): any {
        const {definition, compositeKeys} = this;
        const {name} = this.options;
        const {result, entities} = denormalizeState;

        const entity = getIn([name, result])(entities);

        const mainDenormalizedState = definition.denormalize({result: entity[definition.options.name], entities}, path);



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

        return definition.definition.options.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}

export default function CompositeEntitySchemaFactory(...args: any[]): CompositeEntitySchema {
    return new CompositeEntitySchema(...args);
}

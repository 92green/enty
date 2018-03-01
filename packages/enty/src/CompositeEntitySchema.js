// @flow
import {getIn} from 'stampy/lib/util/CollectionUtils';

import type {NormalizeState} from '../definitions';
import type {DenormalizeState} from '../definitions';

import {CompositeDefinitionMustBeEntityError} from '../utils/Error';
import {CompositeKeysMustBeEntitiesError} from '../utils/Error';
import {NoDefinitionError} from '../utils/Error';

/**
 * @module Schema
 */

/**
 * CompositeEntitySchema
 *
 * @memberof module:Schema
 */
export class CompositeEntitySchema {
    type: string;
    name: string;
    options: Object;
    constructor(name: string, options: Object = {}) {
        this.name = name;
        this.type = 'entity';
        this.options = {
            definition: null,
            compositeKeys: {},
            ...options
        };
    }

    /**
     * CompositeEntitySchema.define
     */
    define(definition: any): CompositeEntitySchema {
        this.options.definition = definition;
        return this;
    }

    /**
     * CompositeEntitySchema.normalize
     */
    normalize(data: Object, entities: Object = {}): NormalizeState {
        const {options, name} = this;
        const {definition, compositeKeys} = options;

        const adjustedData = Object.assign({}, data);

        let idList = [];

        if(!definition) {
            throw NoDefinitionError(name);
        }

        if(definition.type !== 'entity') {
            throw CompositeDefinitionMustBeEntityError(name, definition.type);
        }

        const compositeResults = Object.keys(compositeKeys)
            .reduce((rr: Object, key: string): Object => {
                if(compositeKeys[key].type !== 'entity') {
                    throw CompositeKeysMustBeEntitiesError(`${name}.${key}`, compositeKeys[key].type);
                }

                const {result: compositeResult} = compositeKeys[key].normalize(adjustedData[key], entities);

                rr[key] = compositeResult;
                idList.push(compositeResult);
                delete adjustedData[key];
                return rr;
            }, {});



        // recurse into the main definition
        let {schemas, result: mainResult} = definition.normalize(adjustedData, entities);

        const result = {
            [definition.name]: mainResult,
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
        const {name, options} = this;
        const {definition, compositeKeys} = options;
        const {result, entities} = denormalizeState;

        const entity = getIn(entities, [name, result]);

        const mainDenormalizedState = definition.denormalize({result: entity[definition.name], entities}, path);


        const compositeDenormalizedState = Object.keys(compositeKeys)
            .reduce((rr: Object, key: string): Object => {
                rr[key] = compositeKeys[key].denormalize({result: entity[key], entities}, path);
                return rr;
            }, {});

        // console.log(definition.options.definition.options.merge);

        return definition.options.definition.options.merge(mainDenormalizedState, compositeDenormalizedState);
    }
}

export default function CompositeEntitySchemaFactory(...args: any[]): CompositeEntitySchema {
    return new CompositeEntitySchema(...args);
}

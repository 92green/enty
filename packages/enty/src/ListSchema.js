// @flow
import {List} from 'immutable';
import {ArraySchema} from './ArraySchema';
import type {StructureInput} from './util/definitions';

export class ListSchema extends ArraySchema {

    /**
     * An array schema that casts the data to an immutable js List
     *
     * @param {Schema} definition
     * The defition of the list
     */
    constructor(definition: Object, options: StructureInput = {}) {
        super(definition, options);
        this.options = {
            constructor: item => List(item),
            merge: (previous, next) => previous.merge(next),
            ...options
        };
    }
}


/**
 * An array schema that casts the data to an immutable js List
 * @memberof module:ListSchema
 */
export default function ListSchemaFactory(...args: any[]): ListSchema {
    return new ListSchema(...args);
}

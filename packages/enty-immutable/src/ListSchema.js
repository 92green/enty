// @flow
import {List} from 'immutable';
import {ArraySchema} from 'enty';
import type {StructureInput} from 'enty';

/**
 * An array schema that casts the data to an immutable js List
 */
export class ListSchema extends ArraySchema {
    constructor(definition: Object, options: StructureInput = {}) {
        super(definition, options);
        this.options = {
            constructor: item => List(item),
            merge: (previous, next) => next,
            ...options
        };
    }
}


/**
 * An array schema that casts the data to an immutable js List
 */
export default function ListSchemaFactory(...args: any[]): ListSchema {
    return new ListSchema(...args);
}

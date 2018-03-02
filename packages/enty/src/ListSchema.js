// @flow
import {List} from 'immutable';
import {ArraySchema} from './ArraySchema';

/**
 * @module Schema
 */

/**
 * ListSchema
 *
 * @memberof module:Schema
 */
export class ListSchema extends ArraySchema {

    /**
     * @param {Schema} definition
     */
    constructor(definition: Object, options: Object = {}) {
        super(definition, options);
        this.type = 'list';

        this.options = {
            ...this.options,
            constructor: item => List(item),
            merge: (previous, next) => previous.merge(next),
            ...options
        };
    }
}

export default function ListSchemaFactory(...args: any[]): ListSchema {
    return new ListSchema(...args);
}

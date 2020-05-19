// @flow
import {List} from 'immutable';
import {ArraySchema} from 'enty';
import type {StructuralSchemaOptions} from 'enty';
import type {Schema} from 'enty';

export default class ListSchema<A: Schema> extends ArraySchema<A> {
    constructor(shape: A, options?: StructuralSchemaOptions = {}) {
        super(shape, options);
        this.create = (item) => List(item);
    }
}


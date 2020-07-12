import {List} from 'immutable';
import {ArraySchema} from 'enty';
import {StructuralSchemaOptions} from 'enty';
import {Schema} from 'enty';

export default class ListSchema<A extends Schema> extends ArraySchema<A> {
    constructor(shape: A, options: StructuralSchemaOptions = {}) {
        super(shape, options);
        this.create = (item) => List(item);
    }
}

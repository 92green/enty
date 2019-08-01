// @flow
import type {StructuralSchemaOptions} from 'enty';

import {Map} from 'immutable';
import {ObjectSchema} from 'enty';


export default class MapSchema<A: {}> extends ObjectSchema<A> {
    constructor(shape: A, options?: StructuralSchemaOptions = {}) {
        super(shape, options);
        this.create = (item) => Map(item);
        this.merge = (previous, next) => previous.merge(next);
    }
}


// @flow
import type {Schema} from './util/definitions';


export default class NullSchema implements Schema {
    shape: any;
    parentName: string;

    constructor(parentName: string) {
        this.parentName = parentName;
    }

    _error(method: string): Error {
        return new Error(`Tried to call .${method}() on '${this.parentName}' schema, but it does not have a shape. Please check your configuration.`);
    }

    create = () => {
        throw this._error('create');
    }

    merge = () => {
        throw this._error('merge');
    }

    idAttribute() {
        throw this._error('idAttribute');
    }

    normalize() {
        throw this._error('normalize');
    }

    denormalize() {
        throw this._error('denormalize');
    }
}

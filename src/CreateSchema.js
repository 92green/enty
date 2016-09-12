import {Schema} from 'normalizr';

export function createSchema(key, id = 'id', defaults) {
    return new Schema(key, {
        idAttribute: id,
        defaults
    });
}

import {denormalize} from 'denormalizr';
import {Map} from 'immutable';

export function EntitySelect(schema, state, path) {
    return denormalize(state.entity.getIn(path), state.entity, schema[path[0]]);
}

export function EntitySelectByResult(schema, state, path) {
    return state.entity
        .getIn(['result'].concat(path[0]), Map())
        .map((ii, schemaName) => {
            return denormalize(ii, state.entity, schema[schemaName]);
        })
        .getIn(path.slice(1), Map())
        .toObject();
}

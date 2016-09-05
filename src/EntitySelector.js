import {denormalize} from 'denormalizr';
import {Map} from 'immutable';


export function selectEntity(state, resultKey, schema) {
    var {entity} = state;
    return denormalize(
        entity.getIn(['_result', resultKey]),
        entity,
        schema || entity.getIn(['_schema', resultKey])
    );
}

export function selectEntityByPath(state, path, schema) {
    var {entity} = state;
    return denormalize(
        entity.getIn(path),
        entity,
        schema || entity.getIn(['_schema', path[0]])
    );
}

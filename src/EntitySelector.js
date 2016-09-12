import {denormalize} from 'denormalizr';
import {Map} from 'immutable';


export function selectEntity(state, resultKey, schemaKey = 'mainSchema') {
    var {entity} = state;
    var data = denormalize(
        entity.getIn(['_result', resultKey]),
        entity,
        entity.getIn(['_schema', schemaKey]).toJS()
    );

    return data && data.toObject();
}

export function selectEntityByPath(state, path, schemaKey = 'mainSchema') {
    var {entity} = state;
    return denormalize(
        entity.getIn(path),
        entity,
        entity.getIn(['_schema', schemaKey, path[0]])
    );
}

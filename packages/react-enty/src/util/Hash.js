// @flow
import {fromJS} from 'immutable';

export default function Hash(data: *) {
    return fromJS(data).hashCode().toString();
}


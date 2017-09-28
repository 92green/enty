/* @flow */
/* eslint-disable no-unused-vars */

import {Map} from 'immutable';

export type NormalizeState = {
    entities: Object|Map<any,any>,
    result: Object
};

export type SelectOptions = {
    schemaKey?: string,
    stateKey?: string
};

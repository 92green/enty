/* @flow */
/* eslint-disable no-unused-vars */

import {Map} from 'immutable';

export type NormalizeState = {
    entities: Object|Map,
    result: Object|Map
};

export type SelectOptions = {
    schemaKey?: string,
    stateKey?: string
};
